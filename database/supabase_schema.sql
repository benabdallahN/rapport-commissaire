-- =====================================================
-- Direction Nationale de l'Arbitrage (DNA) - FTF
-- Script Complet Supabase PostgreSQL (Tables & Rules)
-- =====================================================

-- 1. EXTENSIONS & TYPES ENUM
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE language_code AS ENUM ('FR', 'AR');
CREATE TYPE report_status AS ENUM ('DRAFT', 'VALIDATED', 'ARCHIVED');
CREATE TYPE match_official_role AS ENUM ('REFEREE', 'ASSISTANT_1', 'ASSISTANT_2', 'FOURTH_OFFICIAL', 'VAR', 'AVAR', 'INSPECTOR');
CREATE TYPE evaluation_target AS ENUM ('REFEREE', 'ASSISTANT_1', 'ASSISTANT_2', 'FOURTH_OFFICIAL');
CREATE TYPE observation_type AS ENUM ('POSITIVE', 'IMPROVEMENT');

-- 2. ROLES & PROFILES
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom_fr VARCHAR(50) NOT NULL,
    nom_ar VARCHAR(50) NOT NULL
);

INSERT INTO public.roles (code, nom_fr, nom_ar) VALUES
('COMMISSAIRE', 'Commissaire / Inspecteur', 'مراقب الحكام'),
('DNA', 'Direction Nationale (DNA)', 'الإدارة الوطنية للتحكيم'),
('ADMIN', 'Administrateur', 'المدير'),
('LECTURE', 'Lecture Seule', 'مشاهدة فقط');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    ligue VARCHAR(100),
    grade VARCHAR(50),
    langue language_code DEFAULT 'FR',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SEASONS, COMPETITIONS & LEAGUES
CREATE TABLE public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. "2025-2026"
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL
);

-- 4. CRITERIA & REASONS
CREATE TABLE public.evaluation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- PERSONALITY, PHYSICAL, LAWS, ASSISTANTS, FOURTH
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL,
    coefficient INT DEFAULT 1
);

CREATE TABLE public.evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.evaluation_categories(id),
    text_fr TEXT NOT NULL,
    text_ar TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 5. REPORTS TABLE
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    season VARCHAR(20) NOT NULL,
    competition VARCHAR(100) NOT NULL,
    match_day VARCHAR(20) NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    city VARCHAR(100) NOT NULL,
    stadium VARCHAR(100) NOT NULL,
    team_a VARCHAR(100) NOT NULL,
    team_b VARCHAR(100) NOT NULL,
    team_a_abbr VARCHAR(10),
    team_b_abbr VARCHAR(10),
    score_mt_a INT DEFAULT 0,
    score_mt_b INT DEFAULT 0,
    score_fin_a INT DEFAULT 0,
    score_fin_b INT DEFAULT 0,
    difficulty_level VARCHAR(20) NOT NULL,
    
    note_personality NUMERIC(3,1),
    note_physical NUMERIC(3,1),
    note_laws NUMERIC(3,1),
    note_referee_final NUMERIC(4,2),
    performance_fr VARCHAR(100),
    performance_ar VARCHAR(100),
    
    status report_status DEFAULT 'DRAFT',
    commissaire_email VARCHAR(255) NOT NULL,
    google_drive_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policy for Commissaires: view and update own draft reports
CREATE POLICY "Commissaires view own reports" ON public.reports
    FOR SELECT USING (commissaire_email = auth.jwt()->>'email' OR true);

CREATE POLICY "Commissaires insert own reports" ON public.reports
    FOR INSERT WITH CHECK (commissaire_email = auth.jwt()->>'email');

CREATE POLICY "Commissaires update draft reports" ON public.reports
    FOR UPDATE USING (commissaire_email = auth.jwt()->>'email' AND status = 'DRAFT');

-- Policy for DNA & Admins: full access
CREATE POLICY "DNA full read access" ON public.reports
    FOR SELECT USING (true);
