import React, { useState } from 'react';
import { MatchOfficial, OfficialRole, Language } from '../../types';
import { LEAGUES_LIST, GRADES_LIST } from '../../data/mockData';
import { COMPETITION_HIERARCHY } from '../../data/officialsDatabase';
import { sendValidationEmailViaResend } from '../../lib/resendService';
import {
  Users,
  X,
  Search,
  Plus,
  UserCheck,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  Calendar,
  CreditCard,
  Trophy,
  AlertCircle,
  KeyRound,
  UserPlus
} from 'lucide-react';

export interface OfficialItem {
  id: string;
  nom?: string;
  prenom?: string;
  name: string; // Nom et Prénom
  nameAR?: string; // Nom et Prénom en arabe
  fullNameAR?: string;
  role: OfficialRole; // 'REFEREE' | 'ASSISTANT_1' | 'ASSISTANT_2' | 'FOURTH' | 'INSPECTOR' | 'VAR' | 'AVAR'
  league: string; // Ligue régionale
  grade: string; // Grade
  competitionAppartenance: string; // Compétition d'appartenance
  phone?: string; // WhatsApp
  email?: string; // Adresse électronique
  cin?: string; // Carte d'Identité Nationale
  dateNaissance?: string; // YYYY-MM-DD
  matchesCount: number;
  averageScore: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRAINING';
  isUserAccountCreated?: boolean;
}

export const INITIAL_OFFICIALS_DATABASE: OfficialItem[] = [
  {
    id: 'off_1',
    nom: 'Hosni',
    prenom: 'Naim',
    name: 'Naim Hosni',
    nameAR: 'نعيم حسني',
    role: 'REFEREE',
    league: 'Tunis',
    grade: 'International (FIFA)',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1988-04-12',
    cin: '08123456',
    phone: '+216 98 123 456',
    email: 'naim.hosni@ftf.org.tn',
    matchesCount: 14,
    averageScore: 8.42,
    status: 'ACTIVE',
  },
  {
    id: 'off_2',
    nom: 'Loussif',
    prenom: 'Amir',
    name: 'Amir Loussif',
    nameAR: 'أمير اللوصيف',
    role: 'REFEREE',
    league: 'Kairouan',
    grade: 'Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1990-09-25',
    cin: '07234567',
    phone: '+216 97 234 567',
    email: 'amir.loussif@ftf.org.tn',
    matchesCount: 11,
    averageScore: 8.15,
    status: 'ACTIVE',
  },
  {
    id: 'off_3',
    nom: 'Melki',
    prenom: 'Mahrez',
    name: 'Mahrez Melki',
    nameAR: 'محرز المالكي',
    role: 'REFEREE',
    league: 'Nord (Bizerte)',
    grade: 'Fédéral',
    competitionAppartenance: 'Ligue II (Professionnelle)',
    dateNaissance: '1992-01-15',
    cin: '06345678',
    phone: '+216 22 345 678',
    email: 'mahrez.melki@ftf.org.tn',
    matchesCount: 9,
    averageScore: 8.28,
    status: 'ACTIVE',
  },
  {
    id: 'off_4',
    nom: 'Hmila',
    prenom: 'Anouar',
    name: 'Anouar Hmila',
    nameAR: 'أنور هميلة',
    role: 'ASSISTANT_1',
    league: 'Centre (Sousse)',
    grade: 'International (FIFA)',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1986-11-03',
    cin: '05456789',
    phone: '+216 98 456 789',
    email: 'anouar.hmila@ftf.org.tn',
    matchesCount: 16,
    averageScore: 8.55,
    status: 'ACTIVE',
  },
  {
    id: 'off_5',
    nom: 'Ismail',
    prenom: 'Aymen',
    name: 'Aymen Ismail',
    nameAR: 'أيمن إسماعيل',
    role: 'ASSISTANT_2',
    league: 'Sud (Sfax)',
    grade: 'Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1991-06-20',
    cin: '04567890',
    phone: '+216 24 567 890',
    email: 'aymen.ismail@ftf.org.tn',
    matchesCount: 12,
    averageScore: 8.35,
    status: 'ACTIVE',
  },
  {
    id: 'off_6',
    nom: 'Ben Hassine',
    prenom: 'Mohamed Ali',
    name: 'Mohamed Ali Ben Hassine',
    nameAR: 'محمد علي بن حسين',
    role: 'INSPECTOR',
    league: 'Tunis',
    grade: 'Commissaire / Inspecteur Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1975-03-30',
    cin: '01888999',
    phone: '+216 98 888 999',
    email: 'assesseurstunisie@gmail.com',
    matchesCount: 18,
    averageScore: 8.80,
    status: 'ACTIVE',
    isUserAccountCreated: true,
  },
  {
    id: 'off_7',
    nom: 'Bouglia',
    prenom: 'Ridha',
    name: 'Ridha Bouglia',
    nameAR: 'رضا بوقلية',
    role: 'INSPECTOR',
    league: 'Tunis',
    grade: 'Commissaire / Inspecteur Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    dateNaissance: '1972-12-14',
    cin: '01777666',
    phone: '+216 98 777 666',
    email: 'ridha.bouglia@ftf.org.tn',
    matchesCount: 15,
    averageScore: 8.65,
    status: 'ACTIVE',
    isUserAccountCreated: true,
  },
];

interface OfficialsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectOfficialForReport?: (official: OfficialItem) => void;
}

export const OfficialsTableModal: React.FC<OfficialsTableModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectOfficialForReport,
}) => {
  const isAR = lang === 'AR';
  const [officials, setOfficials] = useState<OfficialItem[]>(INITIAL_OFFICIALS_DATABASE);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [leagueFilter, setLeagueFilter] = useState<string>('ALL');

  // Form State for Adding / Editing
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [accountCreatedToast, setAccountCreatedToast] = useState<{ email: string; password: string; name: string } | null>(null);

  const [editingOfficial, setEditingOfficial] = useState<Partial<OfficialItem>>({
    role: 'REFEREE',
    name: '',
    league: 'Tunis',
    grade: 'Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    status: 'ACTIVE',
    matchesCount: 0,
    averageScore: 8.0,
    phone: '',
    email: '',
    cin: '',
    dateNaissance: '',
  });

  if (!isOpen) return null;

  const isCommissaireRole = editingOfficial.role === 'INSPECTOR';

  const handleSaveOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!editingOfficial.name?.trim()) {
      setValidationError(isAR ? 'يرجى إدخال الاسم واللقب' : 'Le nom et prénom est obligatoire.');
      return;
    }

    // MANDATORY FIELDS CHECK FOR COMMISSAIRES
    if (isCommissaireRole) {
      if (!editingOfficial.email?.trim()) {
        setValidationError(
          isAR
            ? 'البريد الإلكتروني إجباري للمراقبين لإنشاء حساب Supabase Auth'
            : 'L\'adresse électronique est OBLIGATOIRE pour un Commissaire (nécessaire pour Supabase Auth).'
        );
        return;
      }
      if (!editingOfficial.cin?.trim()) {
        setValidationError(
          isAR
            ? 'رقم بطاقة التعريف الوطنية إجباري للمراقبين'
            : 'Le numéro de Carte d\'Identité Nationale (CIN) est OBLIGATOIRE pour un Commissaire.'
        );
        return;
      }
      if (!editingOfficial.phone?.trim()) {
        setValidationError(
          isAR
            ? 'رقم الهاتف (واتساب) إجباري للمراقبين'
            : 'Le numéro de téléphone (WhatsApp) est OBLIGATOIRE pour un Commissaire.'
        );
        return;
      }
      if (!editingOfficial.dateNaissance?.trim()) {
        setValidationError(
          isAR
            ? 'تاريخ الميلاد إجباري للمراقبين'
            : 'La date de naissance est OBLIGATOIRE pour un Commissaire.'
        );
        return;
      }
    }

    let generatedPass = '';
    let isNewAccount = false;

    if (editingOfficial.id) {
      // Update existing official
      setOfficials((prev) =>
        prev.map((o) => (o.id === editingOfficial.id ? ({ ...o, ...editingOfficial } as OfficialItem) : o))
      );
    } else {
      // Create new official
      if (isCommissaireRole) {
        generatedPass = `FTF_${Math.random().toString(36).substring(2, 8).toUpperCase()}!2026`;
        isNewAccount = true;
      }

      const newOfficial: OfficialItem = {
        id: `off_${Date.now()}`,
        role: editingOfficial.role || 'REFEREE',
        name: editingOfficial.name.trim(),
        league: editingOfficial.league || 'Tunis',
        grade: editingOfficial.grade || 'Fédéral',
        competitionAppartenance: editingOfficial.competitionAppartenance || 'Ligue I (Professionnelle)',
        phone: editingOfficial.phone?.trim() || '',
        email: editingOfficial.email?.trim() || '',
        cin: editingOfficial.cin?.trim() || '',
        dateNaissance: editingOfficial.dateNaissance || '',
        matchesCount: Number(editingOfficial.matchesCount) || 0,
        averageScore: Number(editingOfficial.averageScore) || 8.0,
        status: editingOfficial.status || 'ACTIVE',
        isUserAccountCreated: isCommissaireRole ? true : false,
      };

      setOfficials((prev) => [newOfficial, ...prev]);

      if (isNewAccount && editingOfficial.email) {
        setAccountCreatedToast({
          email: editingOfficial.email,
          password: generatedPass,
          name: editingOfficial.name,
        });
      }
    }

    setIsEditing(false);
  };

  const handleDeleteOfficial = (id: string) => {
    if (window.confirm(isAR ? 'هل أنت تأكد من حذف هذا الرسمى؟' : 'Êtes-vous sûr de vouloir supprimer cet officiel ?')) {
      setOfficials((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const filteredOfficials = officials.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.nameAR && o.nameAR.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.cin && o.cin.includes(searchTerm)) ||
      (o.email && o.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'REFEREE' && o.role === 'REFEREE') ||
      (roleFilter === 'ASSISTANT' && (o.role === 'ASSISTANT_1' || o.role === 'ASSISTANT_2')) ||
      (roleFilter === 'INSPECTOR' && o.role === 'INSPECTOR');

    const matchesLeague = leagueFilter === 'ALL' || o.league.toLowerCase().includes(leagueFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesLeague;
  });

  const getRoleBadge = (role: OfficialRole) => {
    switch (role) {
      case 'REFEREE':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Arbitre Central</span>;
      case 'ASSISTANT_1':
      case 'ASSISTANT_2':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Arbitre Assistant</span>;
      case 'INSPECTOR':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Commissaire / Inspecteur</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Officiel</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/40 text-amber-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block font-bold">
                Annuaire Unique — FTF / DNA & Supabase Auth
              </span>
              <h2 className="text-lg font-black">
                {isAR ? 'إدارة أطقم التحكيم والحسابات الموحدة (Officiels & Auth)' : 'Gestion Centralisée des Officiels & Comptes Utilisateurs'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingOfficial({
                  role: 'REFEREE',
                  name: '',
                  league: 'Tunis',
                  grade: 'Fédéral',
                  competitionAppartenance: 'Ligue I (Professionnelle)',
                  status: 'ACTIVE',
                  matchesCount: 0,
                  averageScore: 8.0,
                  phone: '',
                  email: '',
                  cin: '',
                  dateNaissance: '',
                });
                setValidationError(null);
                setIsEditing(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAR ? 'إضافة حكم / مراقب جديد' : 'Créer un Officiel'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Created Notification Toast */}
        {accountCreatedToast && (
          <div className="m-4 p-4 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-100 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Compte Utilisateur Supabase Auth Créé Automatiquement !</span>
              </div>
              <p className="text-xs text-emerald-200">
                Un compte Supabase Auth a été généré pour <strong>{accountCreatedToast.name}</strong> et les identifiants ont été expédiés à <strong>{accountCreatedToast.email}</strong>.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-emerald-800 font-mono text-xs flex items-center gap-4 text-emerald-300">
                <span>Identifiant: <strong>{accountCreatedToast.email}</strong></span>
                <span>Mot de passe généré: <strong className="text-amber-300">{accountCreatedToast.password}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setAccountCreatedToast(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAR ? 'بحث بالاسم، CIN، الهاتف، البريد أو الرابطة...' : 'Recherche par nom, CIN, e-mail, ligue...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
            >
              <option value="ALL">Tous les Rôles (Arbitres & Commissaires)</option>
              <option value="REFEREE">Arbitres Centraux</option>
              <option value="ASSISTANT">Arbitres Assistants</option>
              <option value="INSPECTOR">Commissaires / Examinateurs</option>
            </select>

            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="ALL">Toutes les Ligues Régionales</option>
              {LEAGUES_LIST.map((l) => (
                <option key={l.id} value={l.nameFR}>
                  {l.nameFR}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* Create / Edit Form */}
          {isEditing && (
            <form
              onSubmit={handleSaveOfficial}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">
                    {editingOfficial.id ? 'Modifier la Fiche Officiel' : 'Nouveau Officiel de Match'}
                  </h3>
                </div>

                <div className="text-xs">
                  {isCommissaireRole ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Rôle Commissaire : Supabase Auth Activé</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                      Champs CIN / WhatsApp / E-mail Facultatifs pour Arbitres
                    </span>
                  )}
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                
                {/* 1. Nom & Prénom */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    1. Nom et Prénom (FR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOfficial.name || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    placeholder="e.g. Naim Hosni"
                  />
                </div>

                {/* Nom & Prénom AR */}
                <div>
                  <label className="block font-bold mb-1 text-amber-700 dark:text-amber-400">
                    {isAR ? 'الاسم واللقب بالعربية' : 'Nom et Prénom (AR)'}
                  </label>
                  <input
                    type="text"
                    value={editingOfficial.nameAR || editingOfficial.fullNameAR || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, nameAR: e.target.value, fullNameAR: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 font-bold text-right"
                    placeholder="مثال: نعيم حسني"
                    dir="rtl"
                  />
                </div>

                {/* 2. Rôle */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    2. Rôle <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingOfficial.role}
                    onChange={(e) =>
                      setEditingOfficial((p) => ({ ...p, role: e.target.value as OfficialRole }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-amber-600 dark:text-amber-400"
                  >
                    <option value="REFEREE">Arbitre Central</option>
                    <option value="ASSISTANT_1">Arbitre Assistant</option>
                    <option value="INSPECTOR">Commissaire / Examinateur</option>
                  </select>
                </div>

                {/* 3. Ligue Régionale */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    3. Ligue Régionale <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingOfficial.league}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, league: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    {LEAGUES_LIST.map((l) => (
                      <option key={l.id} value={l.nameFR}>
                        {l.nameFR}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Grade */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    4. Grade <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingOfficial.grade}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, grade: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    {GRADES_LIST.map((g) => (
                      <option key={g.id} value={g.nameFR}>
                        {g.nameFR}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Compétition d'appartenance */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    5. Compétition d'appartenance <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingOfficial.competitionAppartenance || 'Ligue I (Professionnelle)'}
                    onChange={(e) =>
                      setEditingOfficial((p) => ({ ...p, competitionAppartenance: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                  >
                    {COMPETITION_HIERARCHY.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} (Rang #{c.rank})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Date de Naissance */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>6. Date de naissance</span>
                    {isCommissaireRole ? (
                      <span className="text-[10px] text-rose-500 font-bold">* Obligatoire</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">(Facultatif)</span>
                    )}
                  </label>
                  <input
                    type="date"
                    value={editingOfficial.dateNaissance || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, dateNaissance: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 ${
                      isCommissaireRole && !editingOfficial.dateNaissance
                        ? 'border-amber-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>

                {/* 7. CIN */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>7. Numéro CIN</span>
                    {isCommissaireRole ? (
                      <span className="text-[10px] text-rose-500 font-bold">* Obligatoire</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">(Facultatif)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={editingOfficial.cin || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, cin: e.target.value }))}
                    placeholder="08123456"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 font-mono ${
                      isCommissaireRole && !editingOfficial.cin
                        ? 'border-amber-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>

                {/* 8. Téléphone WhatsApp */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>8. Téléphone (WhatsApp)</span>
                    {isCommissaireRole ? (
                      <span className="text-[10px] text-rose-500 font-bold">* Obligatoire</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">(Facultatif)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={editingOfficial.phone || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+216 98 000 000"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 font-mono ${
                      isCommissaireRole && !editingOfficial.phone
                        ? 'border-amber-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>

                {/* 9. Adresse électronique */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>9. Adresse électronique</span>
                    {isCommissaireRole ? (
                      <span className="text-[10px] text-rose-500 font-bold">* Obligatoire (Supabase Auth)</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">(Facultatif)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={editingOfficial.email || ''}
                    onChange={(e) => setEditingOfficial((p) => ({ ...p, email: e.target.value }))}
                    placeholder="officiel@ftf.org.tn"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 font-mono ${
                      isCommissaireRole && !editingOfficial.email
                        ? 'border-amber-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>

              </div>

              {/* Actions Form */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">
                  {isCommissaireRole &&
                    'La validation créera automatiquement le compte dans Supabase Auth et enverra le mot de passe par mail.'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {editingOfficial.id ? 'Mettre à jour l\'Officiel' : 'Enregistrer & Activer'}
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* Table View of Officials */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Officiel & Date Naissance</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">CIN & WhatsApp</th>
                  <th className="p-3">E-mail (Supabase Auth)</th>
                  <th className="p-3">Compétition Appartenance</th>
                  <th className="p-3 text-center">Ligue & Grade</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOfficials.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Official Name & DOB */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">
                          {o.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-slate-100">
                            {isAR ? (o.nameAR || o.fullNameAR || o.name) : o.name}
                          </span>
                          {(o.nameAR || o.fullNameAR) && (
                            <span className="block text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                              {isAR ? o.name : (o.nameAR || o.fullNameAR)}
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-400">
                            {o.dateNaissance ? `Né(e) le: ${o.dateNaissance}` : 'Né(e): Non renseigné'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-3">
                      {getRoleBadge(o.role)}
                    </td>

                    {/* CIN & WhatsApp */}
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {o.cin ? `CIN: ${o.cin}` : <span className="text-slate-400 font-normal italic">Sans CIN</span>}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {o.phone || 'Sans Tel'}
                      </div>
                    </td>

                    {/* Email & Auth Status */}
                    <td className="p-3">
                      {o.email ? (
                        <div>
                          <span className="block font-mono text-blue-600 dark:text-blue-400 font-semibold">{o.email}</span>
                          {o.role === 'INSPECTOR' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Supabase Auth Actif
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Non renseigné</span>
                      )}
                    </td>

                    {/* Compétition Appartenance */}
                    <td className="p-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{o.competitionAppartenance}</span>
                    </td>

                    {/* League & Grade */}
                    <td className="p-3 text-center">
                      <div className="font-bold text-slate-700 dark:text-slate-300">{o.league}</div>
                      <span className="text-[10px] text-slate-400">{o.grade}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {onSelectOfficialForReport && (
                          <button
                            onClick={() => {
                              onSelectOfficialForReport(o);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                          >
                            Désigner
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setEditingOfficial(o);
                            setValidationError(null);
                            setIsEditing(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Modifier les 9 attributs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteOfficial(o.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 transition-colors"
                          title="Supprimer l'officiel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
