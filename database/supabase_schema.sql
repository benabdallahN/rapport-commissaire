-- ============================================================================
-- SCHÉMA POSTGRESQL SUPABASE - DIRECTION NATIONALE D'ARBITRAGE (FTF)
-- ============================================================================
-- Version : 2.5 (Intégration du support bilingue FR/AR, noms arabes, examens
--           pratiques, évaluations conjointes et configuration dynamique DNA)
-- ============================================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLE DES PROFILS UTILISATEURS (PROFILES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  full_name_ar VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'COMMISSAIRE' CHECK (role IN ('COMMISSAIRE', 'DNA', 'ADMIN', 'LECTURE')),
  league VARCHAR(100) DEFAULT 'Tunis',
  grade VARCHAR(100) DEFAULT 'Commissaire / Inspecteur Fédéral',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. TABLE ANNUAIRE CENTRAL DES OFFICIELS (OFFICIALS_DATABASE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.officials_database (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cin VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  full_name_ar VARCHAR(255), -- Nom & Prénom en arabe (ex: نعيم حسني)
  date_naissance DATE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('REFEREE', 'ASSISTANT_1', 'ASSISTANT_2', 'FOURTH', 'VAR', 'AVAR', 'INSPECTOR', 'Central', 'Assistant', 'Commissaire', 'Quatrième')),
  ligue_regionale VARCHAR(100) NOT NULL,
  grade VARCHAR(100) NOT NULL,
  competition_appartenance VARCHAR(100),
  rang_national INT,
  phone VARCHAR(30),
  email VARCHAR(255),
  avatar_url TEXT,
  notes_statut TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes de recherche rapide sur l'annuaire
CREATE INDEX IF NOT EXISTS idx_officials_full_name ON public.officials_database(full_name);
CREATE INDEX IF NOT EXISTS idx_officials_full_name_ar ON public.officials_database(full_name_ar);
CREATE INDEX IF NOT EXISTS idx_officials_cin ON public.officials_database(cin);
CREATE INDEX IF NOT EXISTS idx_officials_ligue ON public.officials_database(ligue_regionale);

-- ============================================================================
-- 3. TABLE DES RAPPORTS D'ÉVALUATION (REPORTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL, -- Ex: RAP-2026-001
  season VARCHAR(20) NOT NULL DEFAULT '2025-2026',
  competition VARCHAR(100) NOT NULL, -- Ex: Ligue I Pro
  match_day VARCHAR(20) NOT NULL, -- Ex: J14
  match_date DATE NOT NULL,
  match_time VARCHAR(10),
  city VARCHAR(100) NOT NULL,
  stadium VARCHAR(150),
  
  -- Équipes & Score
  team_a VARCHAR(100) NOT NULL,
  team_b VARCHAR(100) NOT NULL,
  team_a_abbr VARCHAR(10),
  team_b_abbr VARCHAR(10),
  score_half_a INT DEFAULT 0,
  score_half_b INT DEFAULT 0,
  score_final_a INT DEFAULT 0,
  score_final_b INT DEFAULT 0,
  
  -- Niveau de difficulté
  difficulty_level VARCHAR(20) NOT NULL DEFAULT 'MOYENNE' CHECK (difficulty_level IN ('ELEVEE', 'MOYENNE', 'FACILE')),
  
  -- Composition du corps d'arbitrage (Format JSONB enrichi avec nom arabe & ligue)
  officials JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Grille d'évaluation détaillée (Personnalité, Physique, Lois du jeu, Assistants, 4ème)
  evaluations JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Instantané des axes & coefficients DNA appliqués lors de la création
  axes_snapshot JSONB DEFAULT '[]'::jsonb,
  
  -- Scores calculés
  calculated_referee_score NUMERIC(4, 2) DEFAULT 8.00,
  calculated_performance_fr TEXT,
  calculated_performance_ar TEXT,
  
  -- Incidents & Événements
  substitutions JSONB DEFAULT '[]'::jsonb,
  cards JSONB DEFAULT '[]'::jsonb,
  staff_incidents JSONB DEFAULT '[]'::jsonb,
  crowd_incidents JSONB DEFAULT '[]'::jsonb,
  
  -- Remarques générales & Commissaires
  general_comments TEXT,
  commissaire_name VARCHAR(255) NOT NULL,
  commissaire_email VARCHAR(255) NOT NULL,
  
  -- Supervision conjointe (2 commissaires)
  is_joint_evaluation BOOLEAN DEFAULT FALSE,
  second_commissaire_name VARCHAR(255),
  second_commissaire_email VARCHAR(255),
  
  -- Examens pratiques
  practical_exams JSONB DEFAULT '{}'::jsonb,
  
  -- Signature & Validation
  city_signature VARCHAR(100),
  date_signature DATE,
  signature_data_url TEXT,
  
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'VALIDATED', 'ARCHIVED')),
  drive_pdf_url TEXT,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes de recherche sur les rapports
CREATE INDEX IF NOT EXISTS idx_reports_code ON public.reports(code);
CREATE INDEX IF NOT EXISTS idx_reports_season ON public.reports(season);
CREATE INDEX IF NOT EXISTS idx_reports_competition ON public.reports(competition);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports(user_id);

-- ============================================================================
-- 4. TABLES DE PARAMÉTRAGE DNA (AXES, COMPÉTITIONS, LIGUES, GRADES)
-- ============================================================================

-- Axes d'évaluation & coefficients DNA
CREATE TABLE IF NOT EXISTS public.dna_evaluation_axes (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  weight NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
  category VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  description_fr TEXT,
  description_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hiérarchie des compétitions
CREATE TABLE IF NOT EXISTS public.competitions (
  id VARCHAR(50) PRIMARY KEY,
  name_fr VARCHAR(150) NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  rank INT NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT TRUE
);

-- Ligues Régionales
CREATE TABLE IF NOT EXISTS public.leagues (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name_fr VARCHAR(150) NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Grades & Catégories d'Arbitres
CREATE TABLE IF NOT EXISTS public.official_grades (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name_fr VARCHAR(150) NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 5. TRIGGERS POUR LA MISE À JOUR AUTOMATIQUE DE `updated_at`
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_officials ON public.officials_database;
CREATE TRIGGER set_updated_at_officials
  BEFORE UPDATE ON public.officials_database
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reports ON public.reports;
CREATE TRIGGER set_updated_at_reports
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activation RLS sur les tables principales
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dna_evaluation_axes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_grades ENABLE ROW LEVEL SECURITY;

-- 6.1 Politiques pour PROFILES
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6.2 Politiques pour OFFICIALS_DATABASE
CREATE POLICY "Public Read Officials" ON public.officials_database FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Officials" ON public.officials_database FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update Officials" ON public.officials_database FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "DNA Delete Officials" ON public.officials_database FOR DELETE USING (auth.role() = 'authenticated');

-- 6.3 Politiques pour REPORTS
CREATE POLICY "Public Read Reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users Update Own Draft Reports" ON public.reports FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "DNA Delete Reports" ON public.reports FOR DELETE USING (auth.role() = 'authenticated');

-- 6.4 Politiques pour TABLES DE CONFIGURATION
CREATE POLICY "Public Read Axes" ON public.dna_evaluation_axes FOR SELECT USING (true);
CREATE POLICY "Public Read Competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Public Read Leagues" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Public Read Grades" ON public.official_grades FOR SELECT USING (true);

-- ============================================================================
-- 7. DONNÉES DE DÉMARRAGE (DONNÉES SEED DNA FTF)
-- ============================================================================

-- Ligues Régionales
INSERT INTO public.leagues (id, code, name_fr, name_ar) VALUES
('tunis', 'TUNIS', 'Ligue Régionale de Tunis', 'الرابطة الجهوية بتونس'),
('sousse', 'SOUSSE', 'Ligue Régionale du Centre (Sousse)', 'الرابطة الجهوية بالوسط (سوسة)'),
('sfax', 'SFAX', 'Ligue Régionale du Sud (Sfax)', 'الرابطة الجهوية بالجنوب (صفاقس)'),
('bizerte', 'BIZERTE', 'Ligue Régionale du Nord (Bizerte)', 'الرابطة الجهوية بالشمال (بنزرت)'),
('kairouan', 'KAIROUAN', 'Ligue Régionale de Kairouan', 'الرابطة الجهوية بالقيروان'),
('nabeul', 'NABEUL', 'Ligue Régionale de Nabeul', 'الرابطة الجهوية بنابل')
ON CONFLICT (id) DO NOTHING;

-- Grades d'arbitrage
INSERT INTO public.official_grades (id, code, name_fr, name_ar) VALUES
('fifa', 'FIFA', 'International (FIFA)', 'حكم دولي (FIFA)'),
('federal', 'FED', 'Fédéral', 'حكم فدرالي'),
('serie1', 'S1', '1ère Série', 'درجة أولى'),
('serie2', 'S2', '2ème Série', 'درجة ثانية'),
('serie3', 'S3', '3ème Série', 'درجة ثالثة')
ON CONFLICT (id) DO NOTHING;

-- Axes d'évaluation par défaut DNA
INSERT INTO public.dna_evaluation_axes (id, code, name_fr, name_ar, weight, category) VALUES
('personality', 'AXE-1', 'Personnalité & Contrôle du Match', 'الشخصية والسيطرة على المباراة', 0.35, 'PERSONALITY'),
('laws', 'AXE-2', 'Application des Lois du Jeu', 'تطبيق قوانين اللعبة', 0.35, 'LAWS'),
('physical', 'AXE-3', 'Condition Physique & Placement', 'اللياقة البدنية والتمركز', 0.30, 'PHYSICAL')
ON CONFLICT (id) DO NOTHING;

-- Échantillon d'arbitres fédéraux avec noms arabes
INSERT INTO public.officials_database (cin, nom, prenom, full_name, full_name_ar, role, ligue_regionale, grade) VALUES
('08765432', 'Hosni', 'Naim', 'Naim Hosni', 'نعيم حسني', 'REFEREE', 'Tunis', 'International (FIFA)'),
('09123456', 'Loussif', 'Amir', 'Amir Loussif', 'أمير اللوصيف', 'REFEREE', 'Kairouan', 'Fédéral'),
('07654321', 'Melki', 'Mahrez', 'Mahrez Melki', 'محرز المالكي', 'REFEREE', 'Nord (Bizerte)', 'Fédéral'),
('06543210', 'Hmila', 'Anouar', 'Anouar Hmila', 'أنور هميلة', 'ASSISTANT_1', 'Centre (Sousse)', 'International (FIFA)'),
('05432109', 'Ismail', 'Aymen', 'Aymen Ismail', 'أيمن إسماعيل', 'ASSISTANT_2', 'Sud (Sfax)', 'Fédéral'),
('01234567', 'Ben Hassine', 'Mohamed Ali', 'Mohamed Ali Ben Hassine', 'محمد علي بن حسين', 'INSPECTOR', 'Tunis', 'Commissaire / Inspecteur Fédéral'),
('02345678', 'Bouglia', 'Ridha', 'Ridha Bouglia', 'رضا بوقلية', 'INSPECTOR', 'Tunis', 'Commissaire / Inspecteur Fédéral')
ON CONFLICT (cin) DO NOTHING;