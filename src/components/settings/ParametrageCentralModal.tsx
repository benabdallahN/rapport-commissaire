import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import {
  CompetitionItem,
  ClubItem,
  PracticalExamLevelItem,
  getStoredCompetitions,
  saveStoredCompetitions,
  getStoredClubs,
  saveStoredClubs,
  getStoredExamLevels,
  saveStoredExamLevels,
  COMPETITION_TYPES,
} from '../../data/competitionsAndClubsData';
import { StadiumItem, getStoredStadiums, saveStoredStadiums } from '../../data/stadiumsData';
import { EVALUATION_CRITERIA, LEAGUES_LIST, GRADES_LIST } from '../../data/mockData';
import { CriterionItem } from '../../types';
import {
  OfficialFullRecord,
  OfficialRoleCode,
  getStoredOfficials,
  saveStoredOfficials,
  isOfficialEligibleForMatchCompetition,
} from '../../data/officialsDatabase';
import {
  Sliders,
  X,
  Trophy,
  Shield,
  Building2,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  BookOpen,
  MapPin,
  Users,
  Search,
  Sparkles,
  Layers,
  UserCheck,
  ShieldCheck,
  Filter,
  Check,
  Info
} from 'lucide-react';

import {
  DnaEvaluationAxis,
  getStoredDnaAxes,
  saveStoredDnaAxes,
  resetToDefaultDnaAxes,
  calculateDynamicRefereeScore,
} from '../../data/dnaAxesData';

interface ParametrageCentralModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ParametrageCentralModal: React.FC<ParametrageCentralModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAR = lang === 'AR';

  // Active Main Setting Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<
    'COMPETITIONS' | 'CLUBS' | 'STADIUMS' | 'OFFICIALS' | 'EXAMS' | 'CRITERIA' | 'DNA_AXES'
  >('COMPETITIONS');

  // Competitions State
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);
  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [expandedCompId, setExpandedCompId] = useState<string | null>(null);
  const [expandedCompSection, setExpandedCompSection] = useState<'CLUBS' | 'STADIUMS'>('CLUBS');
  const [compNameFR, setCompNameFR] = useState('');
  const [compNameAR, setCompNameAR] = useState('');
  const [compAbbr, setCompAbbr] = useState('');
  const [compType, setCompType] = useState<'Championnat' | 'Coupe de Tunisie' | 'Coupe de la Ligue'>('Championnat');
  const [compSeason, setCompSeason] = useState('2025-2026');
  const [compRank, setCompRank] = useState<number>(1);
  const [compFreeText, setCompFreeText] = useState(false);

  // Clubs State
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [clubAbbr, setClubAbbr] = useState('');
  const [clubNameFR, setClubNameFR] = useState('');
  const [clubNameAR, setClubNameAR] = useState('');
  const [clubSearch, setClubSearch] = useState('');

  // Stadiums State
  const [stadiums, setStadiums] = useState<StadiumItem[]>([]);
  const [editingStadiumId, setEditingStadiumId] = useState<string | null>(null);
  const [stadiumNameFR, setStadiumNameFR] = useState('');
  const [stadiumNameAR, setStadiumNameAR] = useState('');
  const [stadiumCityFR, setStadiumCityFR] = useState('');
  const [stadiumCityAR, setStadiumCityAR] = useState('');
  const [stadiumSearch, setStadiumSearch] = useState('');

  // Officials State
  const [officials, setOfficials] = useState<OfficialFullRecord[]>([]);
  const [editingOfficialId, setEditingOfficialId] = useState<string | null>(null);
  const [officialNom, setOfficialNom] = useState('');
  const [officialPrenom, setOfficialPrenom] = useState('');
  const [officialFullNameAR, setOfficialFullNameAR] = useState('');
  const [officialRole, setOfficialRole] = useState<OfficialRoleCode>('REFEREE');
  const [officialLeague, setOfficialLeague] = useState('Tunis');
  const [officialGrade, setOfficialGrade] = useState('Fédéral');
  const [officialCin, setOfficialCin] = useState('');
  const [officialPhone, setOfficialPhone] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [officialBirthDate, setOfficialBirthDate] = useState('');
  const [officialCompAppartenance, setOfficialCompAppartenance] = useState('Ligue I (Professionnelle)');
  const [officialCompIds, setOfficialCompIds] = useState<string[]>(['comp_l1']);
  const [officialSearch, setOfficialSearch] = useState('');
  const [officialRoleFilter, setOfficialRoleFilter] = useState<string>('ALL');
  const [officialCompFilter, setOfficialCompFilter] = useState<string>('ALL');

  // Exam Levels State
  const [examLevels, setExamLevels] = useState<PracticalExamLevelItem[]>([]);
  const [newExamFR, setNewExamFR] = useState('');
  const [newExamAR, setNewExamAR] = useState('');

  // Criteria State
  const [criteria, setCriteria] = useState<CriterionItem[]>(EVALUATION_CRITERIA);
  const [critCat, setCritCat] = useState<'PERSONALITY' | 'PHYSICAL' | 'LAWS' | 'ASSISTANTS' | 'FOURTH'>('PERSONALITY');
  const [critFR, setCritFR] = useState('');
  const [critAR, setCritAR] = useState('');

  // DNA Axes State
  const [dnaAxes, setDnaAxes] = useState<DnaEvaluationAxis[]>([]);

  // Feedback Notification
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCompetitions(getStoredCompetitions());
      setClubs(getStoredClubs());
      setStadiums(getStoredStadiums());
      setExamLevels(getStoredExamLevels());
      setOfficials(getStoredOfficials());
      setDnaAxes(getStoredDnaAxes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // --- COMPETITIONS ACTIONS ---
  const handleSaveCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compNameFR.trim() || !compNameAR.trim()) return;

    let updated: CompetitionItem[];
    if (editingCompId) {
      updated = competitions.map((c) =>
        c.id === editingCompId
          ? {
              ...c,
              type: compType,
              nameFR: compNameFR.trim(),
              nameAR: compNameAR.trim(),
              abbreviation: compAbbr.trim() || compNameFR.slice(0, 3).toUpperCase(),
              season: compSeason,
              rank: compRank,
              isFreeTextMode: compFreeText,
            }
          : c
      );
      setEditingCompId(null);
    } else {
      const newComp: CompetitionItem = {
        id: `comp_${Date.now()}`,
        type: compType,
        nameFR: compNameFR.trim(),
        nameAR: compNameAR.trim(),
        abbreviation: compAbbr.trim() || compNameFR.slice(0, 3).toUpperCase(),
        season: compSeason,
        rank: compRank,
        status: 'ACTIVE',
        isFreeTextMode: compFreeText,
      };
      updated = [...competitions, newComp];
    }

    setCompetitions(updated);
    saveStoredCompetitions(updated);
    setCompNameFR('');
    setCompNameAR('');
    setCompAbbr('');
    showNotice(isAR ? 'تم حفظ بيانات المسابقة بنجاح' : 'Compétition enregistrée avec succès !');
  };

  const handleToggleCompStatus = (id: string) => {
    const updated = competitions.map((c) =>
      c.id === id ? { ...c, status: (c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'INACTIVE' } : c
    );
    setCompetitions(updated);
    saveStoredCompetitions(updated);
  };

  const handleDeleteCompetition = (id: string) => {
    const updated = competitions.filter((c) => c.id !== id);
    setCompetitions(updated);
    saveStoredCompetitions(updated);
  };

  const handleToggleClubInCompetition = (compId: string, clubId: string) => {
    const updatedClubs = clubs.map((cl) => {
      if (cl.id !== clubId) return cl;
      const currentComps = cl.competitionIds || [];
      const isAssociated = currentComps.includes(compId);
      const newComps = isAssociated
        ? currentComps.filter((id) => id !== compId)
        : [...currentComps, compId];
      return { ...cl, competitionIds: newComps };
    });
    setClubs(updatedClubs);
    saveStoredClubs(updatedClubs);
  };

  const handleAddAllClubsToCompetition = (compId: string) => {
    const updatedClubs = clubs.map((cl) => {
      const currentComps = cl.competitionIds || [];
      if (!currentComps.includes(compId)) {
        return { ...cl, competitionIds: [...currentComps, compId] };
      }
      return cl;
    });
    setClubs(updatedClubs);
    saveStoredClubs(updatedClubs);
    showNotice(isAR ? 'تم ربط جميع الأندية بهذه المسابقة' : 'Tous les clubs associés à la compétition !');
  };

  const handleRemoveAllClubsFromCompetition = (compId: string) => {
    const updatedClubs = clubs.map((cl) => ({
      ...cl,
      competitionIds: (cl.competitionIds || []).filter((id) => id !== compId),
    }));
    setClubs(updatedClubs);
    saveStoredClubs(updatedClubs);
    showNotice(isAR ? 'تم إزالة جميع الأندية من هذه المسابقة' : 'Toutes les équipes retirées de la compétition !');
  };

  const handleToggleStadiumInCompetition = (compId: string, stadiumId: string) => {
    const updatedStadiums = stadiums.map((st) => {
      if (st.id !== stadiumId) return st;
      const currentComps = st.competitionIds || [];
      const isAssociated = currentComps.includes(compId);
      const newComps = isAssociated
        ? currentComps.filter((id) => id !== compId)
        : [...currentComps, compId];
      return { ...st, competitionIds: newComps };
    });
    setStadiums(updatedStadiums);
    saveStoredStadiums(updatedStadiums);
  };

  const handleAddAllStadiumsToCompetition = (compId: string) => {
    const updatedStadiums = stadiums.map((st) => {
      const currentComps = st.competitionIds || [];
      if (!currentComps.includes(compId)) {
        return { ...st, competitionIds: [...currentComps, compId] };
      }
      return st;
    });
    setStadiums(updatedStadiums);
    saveStoredStadiums(updatedStadiums);
    showNotice(isAR ? 'تم ربط جميع الملاعب المعتمدة بهذه المسابقة' : 'Tous les stades homologués associés à la compétition !');
  };

  const handleRemoveAllStadiumsFromCompetition = (compId: string) => {
    const updatedStadiums = stadiums.map((st) => ({
      ...st,
      competitionIds: (st.competitionIds || []).filter((id) => id !== compId),
    }));
    setStadiums(updatedStadiums);
    saveStoredStadiums(updatedStadiums);
    showNotice(isAR ? 'تم إزالة جميع الملاعب من هذه المسابقة' : 'Tous les stades retirés de la compétition !');
  };

  // --- CLUBS ACTIONS ---
  const handleSaveClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubNameFR.trim() || !clubNameAR.trim()) return;

    let updated: ClubItem[];
    if (editingClubId) {
      updated = clubs.map((cl) =>
        cl.id === editingClubId
          ? {
              ...cl,
              abbr: clubAbbr.trim() || clubNameFR.slice(0, 3).toUpperCase(),
              nameFR: clubNameFR.trim(),
              nameAR: clubNameAR.trim(),
            }
          : cl
      );
      setEditingClubId(null);
    } else {
      const newClub: ClubItem = {
        id: `club_${Date.now()}`,
        abbr: clubAbbr.trim() || clubNameFR.slice(0, 3).toUpperCase(),
        nameFR: clubNameFR.trim(),
        nameAR: clubNameAR.trim(),
        competitionIds: competitions.map((c) => c.id),
      };
      updated = [newClub, ...clubs];
    }

    setClubs(updated);
    saveStoredClubs(updated);
    setClubAbbr('');
    setClubNameFR('');
    setClubNameAR('');
    showNotice(isAR ? 'تم حفظ النادي بنجاح' : 'Club enregistré avec succès !');
  };

  const handleDeleteClub = (id: string) => {
    const updated = clubs.filter((c) => c.id !== id);
    setClubs(updated);
    saveStoredClubs(updated);
  };

  // --- STADIUMS ACTIONS ---
  const handleSaveStadium = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stadiumNameFR.trim() || !stadiumNameAR.trim()) return;

    let updated: StadiumItem[];
    if (editingStadiumId) {
      updated = stadiums.map((st) =>
        st.id === editingStadiumId
          ? {
              ...st,
              nameFR: stadiumNameFR.trim(),
              nameAR: stadiumNameAR.trim(),
              cityFR: stadiumCityFR.trim() || 'Tunis',
              cityAR: stadiumCityAR.trim() || stadiumCityFR.trim() || 'تونس',
            }
          : st
      );
      setEditingStadiumId(null);
    } else {
      const newSt: StadiumItem = {
        id: `st_${Date.now()}`,
        nameFR: stadiumNameFR.trim(),
        nameAR: stadiumNameAR.trim(),
        cityFR: stadiumCityFR.trim() || 'Tunis',
        cityAR: stadiumCityAR.trim() || stadiumCityFR.trim() || 'تونس',
        competition: 'Toutes les compétitions',
      };
      updated = [newSt, ...stadiums];
    }

    setStadiums(updated);
    saveStoredStadiums(updated);
    setStadiumNameFR('');
    setStadiumNameAR('');
    setStadiumCityFR('');
    setStadiumCityAR('');
    showNotice(isAR ? 'تم حفظ الملعب بنجاح' : 'Stade enregistré avec succès !');
  };

  const handleDeleteStadium = (id: string) => {
    const updated = stadiums.filter((s) => s.id !== id);
    setStadiums(updated);
    saveStoredStadiums(updated);
  };

  // --- EXAM LEVELS ACTIONS ---
  const handleAddExamLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamFR.trim() || !newExamAR.trim()) return;

    const newLvl: PracticalExamLevelItem = {
      id: `ex_${Date.now()}`,
      code: `EXAM_${Date.now()}`,
      nameFR: newExamFR.trim(),
      nameAR: newExamAR.trim(),
    };
    const updated = [...examLevels, newLvl];
    setExamLevels(updated);
    saveStoredExamLevels(updated);
    setNewExamFR('');
    setNewExamAR('');
    showNotice(isAR ? 'تمت إضافة مستوى الامتحان' : 'Niveau d examen ajouté !');
  };

  const handleDeleteExamLevel = (id: string) => {
    const updated = examLevels.filter((e) => e.id !== id);
    setExamLevels(updated);
    saveStoredExamLevels(updated);
  };

  // --- CRITERIA ACTIONS ---
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!critFR.trim() || !critAR.trim()) return;

    const newItem: CriterionItem = {
      id: `crit_${Date.now()}`,
      categoryId: critCat,
      textFR: critFR.trim(),
      textAR: critAR.trim(),
    };
    setCriteria([newItem, ...criteria]);
    setCritFR('');
    setCritAR('');
    showNotice(isAR ? 'تمت إضافة المعيار' : 'Critère ajouté avec succès !');
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  // --- OFFICIALS ACTIONS ---
  const handleSaveOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialNom.trim() || !officialPrenom.trim()) return;

    let updated: OfficialFullRecord[];
    const fullName = `${officialPrenom.trim()} ${officialNom.trim()}`;
    const arName = officialFullNameAR.trim();

    if (editingOfficialId) {
      updated = officials.map((off) =>
        off.id === editingOfficialId
          ? {
              ...off,
              nom: officialNom.trim(),
              prenom: officialPrenom.trim(),
              fullName,
              fullNameAR: arName || undefined,
              nameAR: arName || undefined,
              role: officialRole,
              ligueRegionale: officialLeague,
              grade: officialGrade,
              cin: officialCin.trim(),
              telephoneWhatsapp: officialPhone.trim(),
              email: officialEmail.trim(),
              dateNaissance: officialBirthDate,
              competitionAppartenance: officialCompAppartenance,
              competitionIds: officialCompIds,
            }
          : off
      );
      setEditingOfficialId(null);
    } else {
      const newOff: OfficialFullRecord = {
        id: `off_${Date.now()}`,
        nom: officialNom.trim(),
        prenom: officialPrenom.trim(),
        fullName,
        fullNameAR: arName || undefined,
        nameAR: arName || undefined,
        role: officialRole,
        ligueRegionale: officialLeague,
        grade: officialGrade,
        cin: officialCin.trim(),
        telephoneWhatsapp: officialPhone.trim(),
        email: officialEmail.trim(),
        dateNaissance: officialBirthDate,
        competitionAppartenance: officialCompAppartenance,
        competitionIds: officialCompIds,
        matchesCount: 0,
        averageScore: 8.0,
        status: 'ACTIVE',
      };
      updated = [newOff, ...officials];
    }

    setOfficials(updated);
    saveStoredOfficials(updated);
    setOfficialNom('');
    setOfficialPrenom('');
    setOfficialFullNameAR('');
    setOfficialCin('');
    setOfficialPhone('');
    setOfficialEmail('');
    setOfficialBirthDate('');
    setOfficialCompIds(['comp_l1']);
    showNotice(isAR ? 'تم حفظ بيانات الرسمى بنجاح' : 'Officiel enregistré avec succès !');
  };

  const handleDeleteOfficial = (id: string) => {
    const updated = officials.filter((o) => o.id !== id);
    setOfficials(updated);
    saveStoredOfficials(updated);
    showNotice(isAR ? 'تم حذف الرسمى' : 'Officiel supprimé !');
  };

  const handleToggleCompetitionForOfficial = (officialId: string, compId: string) => {
    const updated = officials.map((off) => {
      if (off.id !== officialId) return off;
      const current = off.competitionIds || [];
      const isAssoc = current.includes(compId);
      const nextComps = isAssoc
        ? current.filter((id) => id !== compId)
        : [...current, compId];
      return { ...off, competitionIds: nextComps };
    });
    setOfficials(updated);
    saveStoredOfficials(updated);
  };

  const handleToggleAllCompetitionsToOfficial = (officialId: string, addAll: boolean) => {
    const nextComps = addAll ? competitions.map((c) => c.id) : [];
    const updated = officials.map((off) =>
      off.id === officialId ? { ...off, competitionIds: nextComps } : off
    );
    setOfficials(updated);
    saveStoredOfficials(updated);
  };

  // Filtered Lists for UI Search
  const filteredClubs = clubs.filter(
    (c) =>
      c.nameFR.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.nameAR.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.abbr.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const filteredStadiums = stadiums.filter(
    (s) =>
      s.nameFR.toLowerCase().includes(stadiumSearch.toLowerCase()) ||
      s.nameAR.toLowerCase().includes(stadiumSearch.toLowerCase()) ||
      s.cityFR.toLowerCase().includes(stadiumSearch.toLowerCase())
  );

  const filteredOfficials = officials.filter((off) => {
    const searchLower = officialSearch.toLowerCase();
    const matchSearch =
      !officialSearch ||
      (off.nom && off.nom.toLowerCase().includes(searchLower)) ||
      (off.prenom && off.prenom.toLowerCase().includes(searchLower)) ||
      (off.fullName && off.fullName.toLowerCase().includes(searchLower)) ||
      (off.cin && off.cin.toLowerCase().includes(searchLower)) ||
      (off.email && off.email.toLowerCase().includes(searchLower));

    const matchRole =
      officialRoleFilter === 'ALL' || off.role === officialRoleFilter;

    const matchComp =
      officialCompFilter === 'ALL' ||
      (off.competitionIds && off.competitionIds.includes(officialCompFilter)) ||
      isOfficialEligibleForMatchCompetition(off, officialCompFilter, competitions);

    return matchSearch && matchRole && matchComp;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/40 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-red-900/60 border border-red-700/50">
                  FTF / DNA Central Config
                </span>
                {notice && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold animate-pulse">
                    {notice}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {isAR ? 'مركز إدارة وإعدادات التطبيق (Paramétrage)' : 'Centre de Paramétrage Centralisé — FTF / DNA'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-2 border-b border-slate-200 dark:border-slate-700 flex overflow-x-auto gap-1.5 shrink-0">
          <button
            onClick={() => setActiveSubTab('COMPETITIONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'COMPETITIONS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{isAR ? '1. المسابقات والأنواع' : '1. Compétitions'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{competitions.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('CLUBS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'CLUBS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{isAR ? '2. الأندية والفرق' : '2. Clubs & Équipes'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{clubs.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('STADIUMS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'STADIUMS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isAR ? '3. الملاعب المعتمدة' : '3. Stades Homologués'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{stadiums.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('OFFICIALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'OFFICIALS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isAR ? '4. الرسميون والتراخيص' : '4. Officiels & Habilitations'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{officials.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('EXAMS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'EXAMS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isAR ? '5. الامتحانات التطبيقية' : '5. Examens Pratiques'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{examLevels.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('CRITERIA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'CRITERIA'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAR ? '6. معايير التقييم' : '6. Critères & Obser. DNA'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('DNA_AXES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'DNA_AXES'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-500/20'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>{isAR ? '7. محاور التقييم ومعاملات DNA' : '7. Axes DNA & Coefficients'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 font-mono font-bold">
              {dnaAxes.length > 0 ? dnaAxes.length : 3}
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: COMPETITIONS */}
          {activeSubTab === 'COMPETITIONS' && (
            <div className="space-y-6">
              {/* Form to Create/Edit Competition */}
              <form onSubmit={handleSaveCompetition} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-red-600" />
                    <span>{editingCompId ? (isAR ? 'تعديل مسابقة' : 'Modifier la Compétition') : (isAR ? 'إضافة مسابقة جديدة' : 'Nouveau Paramétrage de Compétition')}</span>
                  </h3>
                  {editingCompId && (
                    <button
                      type="button"
                      onClick={() => setEditingCompId(null)}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      {isAR ? 'إلغاء التعديل' : 'Annuler'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'نوع المسابقة' : 'Type de compétition'}</label>
                    <select
                      value={compType}
                      onChange={(e) => setCompType(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {COMPETITION_TYPES.map((t) => (
                        <option key={t.code} value={t.code}>{isAR ? t.nameAR : t.nameFR}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم المسابقة بالفرنسية' : 'Nom (Français)'}</label>
                    <input
                      type="text"
                      required
                      value={compNameFR}
                      onChange={(e) => setCompNameFR(e.target.value)}
                      placeholder="Ex: Ligue I (Professionnelle)"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم المسابقة بالعربية' : 'Nom (Arabe)'}</label>
                    <input
                      type="text"
                      required
                      value={compNameAR}
                      onChange={(e) => setCompNameAR(e.target.value)}
                      placeholder="مثال: الرابطة المحترفة الأولى"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الإختصار (Abréviation)' : 'Abréviation'}</label>
                    <input
                      type="text"
                      value={compAbbr}
                      onChange={(e) => setCompAbbr(e.target.value)}
                      placeholder="Ex: L1"
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الموسم الرياضي' : 'Saison'}</label>
                    <input
                      type="text"
                      value={compSeason}
                      onChange={(e) => setCompSeason(e.target.value)}
                      placeholder="2025-2026"
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الترتيب الهيكلي (Ordre)' : 'Ordre hiérarchique'}</label>
                    <input
                      type="number"
                      value={compRank}
                      onChange={(e) => setCompRank(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={compFreeText}
                      onChange={(e) => setCompFreeText(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300"
                    />
                    <span>{isAR ? 'وضع الكتابة الحرة (الرابطة الجهوية، الكرة النسائية، الشبان)' : 'Mode Saisie Libre (Ligue Régionale, Féminin, Jeunes)'}</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingCompId ? (isAR ? 'تحديث' : 'Mettre à jour') : (isAR ? 'إضافة المسابقة' : 'Enregistrer la Compétition')}</span>
                  </button>
                </div>
              </form>

              {/* Table of Competitions */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">{isAR ? 'النوع' : 'Type'}</th>
                      <th className="p-3">{isAR ? 'اسم المسابقة' : 'Nom de la compétition'}</th>
                      <th className="p-3 text-center">{isAR ? 'الرمز' : 'Abbr'}</th>
                      <th className="p-3 text-center">{isAR ? 'الأندية المشاركة' : 'Équipes'}</th>
                      <th className="p-3 text-center">{isAR ? 'الملاعب المعتمدة' : 'Stades Homologués'}</th>
                      <th className="p-3 text-center">{isAR ? 'الموسم' : 'Saison'}</th>
                      <th className="p-3 text-center">{isAR ? 'النمط' : 'Mode Saisie'}</th>
                      <th className="p-3 text-center">{isAR ? 'الحالة' : 'Statut'}</th>
                      <th className="p-3 text-right">{isAR ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {competitions.map((comp) => {
                      const associatedClubs = clubs.filter((cl) =>
                        (cl.competitionIds || []).includes(comp.id)
                      );
                      const associatedStadiums = stadiums.filter((st) =>
                        (st.competitionIds || []).includes(comp.id)
                      );
                      const isExpanded = expandedCompId === comp.id;

                      return (
                        <React.Fragment key={comp.id}>
                          <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-red-50/40 dark:bg-red-950/20' : ''}`}>
                            <td className="p-3 font-mono text-slate-400">{comp.rank}</td>
                            <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">{comp.type}</td>
                            <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                              <div>{comp.nameFR}</div>
                              <div className="text-[11px] text-slate-500 font-arabic">{comp.nameAR}</div>
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-red-600">{comp.abbreviation}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  if (isExpanded && expandedCompSection === 'CLUBS') {
                                    setExpandedCompId(null);
                                  } else {
                                    setExpandedCompId(comp.id);
                                    setExpandedCompSection('CLUBS');
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                                  associatedClubs.length > 0
                                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 hover:bg-red-200'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>{associatedClubs.length} {isAR ? 'أندية' : 'équipes'}</span>
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  if (isExpanded && expandedCompSection === 'STADIUMS') {
                                    setExpandedCompId(null);
                                  } else {
                                    setExpandedCompId(comp.id);
                                    setExpandedCompSection('STADIUMS');
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                                  associatedStadiums.length > 0
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{associatedStadiums.length} {isAR ? 'ملاعب' : 'stades'}</span>
                              </button>
                            </td>
                            <td className="p-3 text-center text-slate-600 font-mono">{comp.season}</td>
                            <td className="p-3 text-center">
                              {comp.isFreeTextMode ? (
                                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                                  {isAR ? 'سائبة / حرة' : 'Saisie Libre'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                                  {isAR ? 'محددة تلقائياً' : 'Flèche Sélect'}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleToggleCompStatus(comp.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                  comp.status === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {comp.status === 'ACTIVE' ? (isAR ? 'نشطة' : 'Active') : (isAR ? 'معطلة' : 'Inactive')}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    if (isExpanded && expandedCompSection === 'CLUBS') {
                                      setExpandedCompId(null);
                                    } else {
                                      setExpandedCompId(comp.id);
                                      setExpandedCompSection('CLUBS');
                                    }
                                  }}
                                  title={isAR ? 'إدارة الأندية المشاركة' : 'Gérer les équipes'}
                                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                                    isExpanded && expandedCompSection === 'CLUBS'
                                      ? 'bg-red-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600'
                                  }`}
                                >
                                  <Users className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (isExpanded && expandedCompSection === 'STADIUMS') {
                                      setExpandedCompId(null);
                                    } else {
                                      setExpandedCompId(comp.id);
                                      setExpandedCompSection('STADIUMS');
                                    }
                                  }}
                                  title={isAR ? 'إدارة الملاعب المعتمدة' : 'Gérer les stades'}
                                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                                    isExpanded && expandedCompSection === 'STADIUMS'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600'
                                  }`}
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCompId(comp.id);
                                    setCompNameFR(comp.nameFR);
                                    setCompNameAR(comp.nameAR);
                                    setCompAbbr(comp.abbreviation);
                                    setCompType(comp.type);
                                    setCompSeason(comp.season);
                                    setCompRank(comp.rank);
                                    setCompFreeText(!!comp.isFreeTextMode);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCompetition(comp.id)}
                                  className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* EXPANDED SUB-PANEL (CLUBS OR STADIUMS) */}
                          {isExpanded && (
                            <tr className="bg-slate-50/90 dark:bg-slate-900/90 border-t border-b border-red-200 dark:border-red-900/50">
                              <td colSpan={10} className="p-4 space-y-4">
                                {/* Sub-panel Section Selector Tabs */}
                                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedCompSection('CLUBS')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                      expandedCompSection === 'CLUBS'
                                        ? 'bg-red-600 text-white shadow-xs'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>{isAR ? 'الأندية المشاركة' : 'Équipes participantes'}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${expandedCompSection === 'CLUBS' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                      {associatedClubs.length}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setExpandedCompSection('STADIUMS')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                      expandedCompSection === 'STADIUMS'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{isAR ? 'الملاعب المعتمدة' : 'Stades homologués autorisés'}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${expandedCompSection === 'STADIUMS' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                      {associatedStadiums.length}
                                    </span>
                                  </button>
                                </div>

                                {expandedCompSection === 'CLUBS' && (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-red-600" />
                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                          {isAR ? `الأندية المشاركة في: ${comp.nameAR}` : `Équipes autorisées à participer à : ${comp.nameFR}`}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[10px]">
                                          {associatedClubs.length} {isAR ? 'نادي' : 'clubs'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleAddAllClubsToCompetition(comp.id)}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 transition-colors"
                                        >
                                          {isAR ? 'تحديد الكل (إضافة كافة الأندية)' : 'Tout Sélectionner'}
                                        </button>
                                        <button
                                          onClick={() => handleRemoveAllClubsFromCompetition(comp.id)}
                                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[11px] font-bold border border-rose-200 dark:border-rose-800 transition-colors"
                                        >
                                          {isAR ? 'إلغاء تحديد الكل' : 'Tout Désélectionner'}
                                        </button>
                                      </div>
                                    </div>

                                    {comp.isFreeTextMode && (
                                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                                        <span>
                                          {isAR
                                            ? 'ملاحظة: هذه المسابقة تعمل بنمط الكتابة الحرة (الرابطة الجهوية، الكرة النسائية، الشبان). الأندية المحددة هنا اختيارية وستكون حقول الفريق المستضيف والضيف حرة عند تحرير تقرير المباراة.'
                                            : 'Mode Saisie Libre actif : Les équipes ne sont pas restreintes. Les champs Équipe recevante et Équipe visiteuse resteront libres lors de la saisie des rapports de match.'}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interactive Club Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                      {clubs.map((club) => {
                                        const isAssociated = (club.competitionIds || []).includes(comp.id);
                                        return (
                                          <button
                                            key={club.id}
                                            type="button"
                                            onClick={() => handleToggleClubInCompetition(comp.id, club.id)}
                                            className={`p-2 rounded-xl text-left border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                              isAssociated
                                                ? 'bg-red-500 text-white border-red-600 shadow-xs'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                              <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-black flex items-center justify-center shrink-0 ${
                                                isAssociated ? 'bg-white text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                              }`}>
                                                {club.abbr}
                                              </span>
                                              <span className="text-[11px] font-bold truncate">
                                                {isAR ? club.nameAR : club.nameFR}
                                              </span>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                              isAssociated ? 'bg-white text-red-600 border-white' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                              {isAssociated && <CheckCircle2 className="w-3.5 h-3.5 fill-red-600 text-white" />}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {expandedCompSection === 'STADIUMS' && (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-amber-600" />
                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                          {isAR ? `الملاعب المعتمدة المسموح بها في: ${comp.nameAR}` : `Stades homologués autorisés pour : ${comp.nameFR}`}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                                          {associatedStadiums.length} {isAR ? 'ملعب' : 'stades'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleAddAllStadiumsToCompetition(comp.id)}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 transition-colors"
                                        >
                                          {isAR ? 'تحديد الكل (إضافة كافة الملاعب)' : 'Tout Sélectionner'}
                                        </button>
                                        <button
                                          onClick={() => handleRemoveAllStadiumsFromCompetition(comp.id)}
                                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[11px] font-bold border border-rose-200 dark:border-rose-800 transition-colors"
                                        >
                                          {isAR ? 'إلغاء تحديد الكل' : 'Tout Désélectionner'}
                                        </button>
                                      </div>
                                    </div>

                                    {comp.isFreeTextMode && (
                                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                                        <span>
                                          {isAR
                                            ? 'ملاحظة: هذه المسابقة تعمل بنمط الكتابة الحرة (الرابطة الجهوية، الكرة النسائية، الشبان). الملاعب المحددة هنا اختيارية وستكون حقول الملعب والمدينة حرة عند تحرير تقرير المباراة.'
                                            : 'Mode Saisie Libre actif : Le Stade et la Ville ne sont pas restreints. Les champs resteront libres lors de la saisie des rapports de match.'}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interactive Stadium Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                      {stadiums.map((st) => {
                                        const isAssociated = (st.competitionIds || []).includes(comp.id);
                                        return (
                                          <button
                                            key={st.id}
                                            type="button"
                                            onClick={() => handleToggleStadiumInCompetition(comp.id, st.id)}
                                            className={`p-2.5 rounded-xl text-left border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                              isAssociated
                                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                              <div className={`p-1.5 rounded-lg shrink-0 ${isAssociated ? 'bg-white text-amber-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                                <MapPin className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="overflow-hidden">
                                                <div className="text-[11px] font-bold truncate">
                                                  {isAR ? st.nameAR : st.nameFR}
                                                </div>
                                                <div className={`text-[10px] truncate ${isAssociated ? 'text-amber-100' : 'text-slate-400'}`}>
                                                  {isAR ? st.cityAR : st.cityFR}
                                                </div>
                                              </div>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                              isAssociated ? 'bg-white text-amber-600 border-white' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                              {isAssociated && <CheckCircle2 className="w-3.5 h-3.5 fill-amber-600 text-white" />}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CLUBS */}
          {activeSubTab === 'CLUBS' && (
            <div className="space-y-6">
              {/* Add Club Form */}
              <form onSubmit={handleSaveClub} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>{editingClubId ? (isAR ? 'تعديل النادي' : 'Modifier le Club') : (isAR ? 'إضافة نادي جديد' : 'Nouveau Club Participant')}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'رمز النادي (Abréviation)' : 'Abréviation'}</label>
                    <input
                      type="text"
                      required
                      value={clubAbbr}
                      onChange={(e) => setClubAbbr(e.target.value)}
                      placeholder="Ex: EST, CA, CSS..."
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم النادي بالفرنسية' : 'Nom du Club (Français)'}</label>
                    <input
                      type="text"
                      required
                      value={clubNameFR}
                      onChange={(e) => setClubNameFR(e.target.value)}
                      placeholder="Ex: Espérance Sportive de Tunis"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم النادي بالعربية' : 'Nom du Club (Arabe)'}</label>
                    <input
                      type="text"
                      required
                      value={clubNameAR}
                      onChange={(e) => setClubNameAR(e.target.value)}
                      placeholder="مثال: الترجي الرياضي التونسي"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingClubId ? (isAR ? 'تحديث النادي' : 'Mettre à jour') : (isAR ? 'إضافة النادي' : 'Enregistrer le Club')}</span>
                  </button>
                </div>
              </form>

              {/* Clubs List & Search */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={clubSearch}
                      onChange={(e) => setClubSearch(e.target.value)}
                      placeholder={isAR ? 'بحث عن نادي...' : 'Rechercher un club...'}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{filteredClubs.length} {isAR ? 'أندية مسجلة' : 'clubs répertoriés'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredClubs.map((club) => {
                    const clubCompIds = club.competitionIds || [];
                    const associatedCompetitions = competitions.filter((comp) => clubCompIds.includes(comp.id));

                    return (
                      <div key={club.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                              {club.abbr}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{club.nameFR}</div>
                              <div className="text-[11px] text-slate-500 font-arabic">{club.nameAR}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingClubId(club.id);
                                setClubAbbr(club.abbr);
                                setClubNameFR(club.nameFR);
                                setClubNameAR(club.nameAR);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClub(club.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Associated Competitions Badges */}
                        <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2 flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-medium me-1">
                            {isAR ? 'المسابقات:' : 'Compétitions:'}
                          </span>
                          {competitions.map((comp) => {
                            const isSelected = clubCompIds.includes(comp.id);
                            return (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => handleToggleClubInCompetition(comp.id, club.id)}
                                title={isAR ? comp.nameAR : comp.nameFR}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                                    : 'bg-white text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                {comp.abbreviation || comp.nameFR.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STADIUMS */}
          {activeSubTab === 'STADIUMS' && (
            <div className="space-y-6">
              {/* Stadium Form */}
              <form onSubmit={handleSaveStadium} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-600" />
                    <span>{editingStadiumId ? (isAR ? 'تعديل الملعب' : 'Modifier le Stade') : (isAR ? 'إضافة ملعب معتمد' : 'Nouveau Stade Homologué')}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم الملعب (فرنسي)' : 'Nom du Stade (Français)'}</label>
                    <input
                      type="text"
                      required
                      value={stadiumNameFR}
                      onChange={(e) => setStadiumNameFR(e.target.value)}
                      placeholder="Ex: Stade Taïeb Mhiri"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اسم الملعب (عربي)' : 'Nom du Stade (Arabe)'}</label>
                    <input
                      type="text"
                      required
                      value={stadiumNameAR}
                      onChange={(e) => setStadiumNameAR(e.target.value)}
                      placeholder="مثال: ملعب الطيب المهيري"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'المدينة (فرنسي)' : 'Ville (Français)'}</label>
                    <input
                      type="text"
                      value={stadiumCityFR}
                      onChange={(e) => setStadiumCityFR(e.target.value)}
                      placeholder="Ex: Sfax"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'المدينة (عربي)' : 'Ville (Arabe)'}</label>
                    <input
                      type="text"
                      value={stadiumCityAR}
                      onChange={(e) => setStadiumCityAR(e.target.value)}
                      placeholder="صفاقس"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingStadiumId ? (isAR ? 'تحديث الملعب' : 'Mettre à jour') : (isAR ? 'إضافة الملعب' : 'Enregistrer le Stade')}</span>
                  </button>
                </div>
              </form>

              {/* Stadiums Search & Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={stadiumSearch}
                      onChange={(e) => setStadiumSearch(e.target.value)}
                      placeholder={isAR ? 'بحث عن ملعب أو مدينة...' : 'Rechercher un stade ou ville...'}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{filteredStadiums.length} {isAR ? 'ملاعب معتمدة' : 'stades homologués'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStadiums.map((st) => {
                    const stCompIds = st.competitionIds || [];
                    return (
                      <div key={st.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{st.nameFR}</div>
                              <div className="text-[11px] text-slate-500 font-arabic">{st.nameAR} ({st.cityFR})</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingStadiumId(st.id);
                                setStadiumNameFR(st.nameFR);
                                setStadiumNameAR(st.nameAR);
                                setStadiumCityFR(st.cityFR);
                                setStadiumCityAR(st.cityAR || '');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStadium(st.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Associated Competitions Badges */}
                        <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2 flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-medium me-1">
                            {isAR ? 'المسابقات:' : 'Compétitions:'}
                          </span>
                          {competitions.map((comp) => {
                            const isSelected = stCompIds.includes(comp.id);
                            return (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => handleToggleStadiumInCompetition(comp.id, st.id)}
                                title={isAR ? comp.nameAR : comp.nameFR}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                                    : 'bg-white text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                {comp.abbreviation || comp.nameFR.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIALS & HABILITATIONS */}
          {activeSubTab === 'OFFICIALS' && (
            <div className="space-y-6">
              {/* Form Create / Edit Official */}
              <form onSubmit={handleSaveOfficial} className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-red-600" />
                    <span>
                      {editingOfficialId
                        ? (isAR ? 'تعديل بيانات الرسمى والحسابات' : 'Modifier les informations de l officiel')
                        : (isAR ? 'إضافة رسمى جديد وتحديد تراخيص المسابقات' : 'Nouveau profil d officiel & Habilitations')}
                    </span>
                  </h3>
                  {editingOfficialId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOfficialId(null);
                        setOfficialNom('');
                        setOfficialPrenom('');
                        setOfficialFullNameAR('');
                        setOfficialCin('');
                        setOfficialPhone('');
                        setOfficialEmail('');
                        setOfficialBirthDate('');
                        setOfficialCompIds(['comp_l1']);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                    >
                      {isAR ? 'إلغاء التعديل' : 'Annuler l édition'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'اللقب (Nom)' : 'Nom'}</label>
                    <input
                      type="text"
                      required
                      value={officialNom}
                      onChange={(e) => setOfficialNom(e.target.value)}
                      placeholder="Ex: Hosni"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الاسم (Prénom)' : 'Prénom'}</label>
                    <input
                      type="text"
                      required
                      value={officialPrenom}
                      onChange={(e) => setOfficialPrenom(e.target.value)}
                      placeholder="Ex: Naim"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">{isAR ? 'الاسم واللقب بالعربية' : 'Nom et Prénom en arabe'}</label>
                    <input
                      type="text"
                      value={officialFullNameAR}
                      onChange={(e) => setOfficialFullNameAR(e.target.value)}
                      placeholder="مثال: نعيم حسني"
                      dir="rtl"
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {isAR ? 'الرتبة الهيكلية الدائمة (Rôle permanent)' : 'Rôle permanent (Qualification)'}
                    </label>
                    <select
                      value={officialRole}
                      onChange={(e) => setOfficialRole(e.target.value as OfficialRoleCode)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="REFEREE">{isAR ? 'حكم ساحة (Arbitre central)' : 'Arbitre central'}</option>
                      <option value="ASSISTANT_1">{isAR ? 'حكم مساعد (Arbitre assistant)' : 'Arbitre assistant'}</option>
                      <option value="INSPECTOR">{isAR ? 'مراقب / مقيم (Commissaire / Examinateur)' : 'Commissaire / Examinateur'}</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isAR
                        ? 'الوظائف الميدانية (حكم 4، VAR، AVAR) تحدد تلقائياً عند التعيين للمباراة'
                        : 'Les fonctions (4ème, VAR, AVAR) sont exercées lors des matchs selon la qualification.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الرابطة الجهوية' : 'Ligue régionale'}</label>
                    <select
                      value={officialLeague}
                      onChange={(e) => setOfficialLeague(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {LEAGUES_LIST.map((l) => (
                        <option key={l.id} value={l.nameFR}>{isAR ? l.nameAR : l.nameFR}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الرتبة / الدرجة' : 'Grade'}</label>
                    <select
                      value={officialGrade}
                      onChange={(e) => setOfficialGrade(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {GRADES_LIST.map((g) => (
                        <option key={g.id} value={g.nameFR}>{isAR ? g.nameAR : g.nameFR}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'رقم الهوية (CIN)' : 'N° CIN'}</label>
                    <input
                      type="text"
                      value={officialCin}
                      onChange={(e) => setOfficialCin(e.target.value)}
                      placeholder="08123456"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'الهاتف / WhatsApp' : 'Téléphone / WhatsApp'}</label>
                    <input
                      type="text"
                      value={officialPhone}
                      onChange={(e) => setOfficialPhone(e.target.value)}
                      placeholder="+216 98 123 456"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      type="email"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="officiel@ftf.org.tn"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Competition Association (Many-to-Many Selection) */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAR ? 'المسابقات المسموح بها لهذا الرسمى (Relation Officiel ↔ Compétition) :' : 'Compétitions autorisées pour cet officiel :'}</span>
                    </label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setOfficialCompIds(competitions.map((c) => c.id))}
                        className="text-red-600 hover:underline font-bold"
                      >
                        {isAR ? 'تحديد الكل' : 'Tout sélectionner'}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setOfficialCompIds([])}
                        className="text-slate-500 hover:underline"
                      >
                        {isAR ? 'إلغاء الكل' : 'Tout désélectionner'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {competitions.map((comp) => {
                      const isChecked = officialCompIds.includes(comp.id);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setOfficialCompIds(officialCompIds.filter((id) => id !== comp.id));
                            } else {
                              setOfficialCompIds([...officialCompIds, comp.id]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-red-600 text-white border-red-700 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {isChecked ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-400" />}
                          <span>{comp.abbreviation || comp.nameFR}</span>
                          <span className="text-[10px] opacity-80 font-mono">(Rang {comp.rank})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingOfficialId ? (isAR ? 'تحديث البيانات' : 'Mettre à jour l officiel') : (isAR ? 'إضافة الرسمى' : 'Enregistrer l officiel')}</span>
                  </button>
                </div>
              </form>

              {/* Rules Explanation Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="font-bold text-amber-950 dark:text-amber-100">
                    {isAR
                      ? 'قواعد الصفة الهيكلية والوظائف الميدانية في المباريات :'
                      : 'Règles de gestion : Rôles permanents vs Fonctions exercées lors d un match :'}
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    <li>
                      <strong>{isAR ? 'الصفة الدائمة (Rôles permanents) :' : 'Rôles permanents en BDD :'}</strong>{' '}
                      {isAR ? 'تقتصر على : حكم ساحة، حكم مساعد، ومراقب / مقيم.' : 'Limités strictement à : Arbitre central, Arbitre assistant, Commissaire / Examinateur.'}
                    </li>
                    <li>
                      <strong>{isAR ? 'وظائف المباراة (Fonctions en match) :' : 'Fonctions lors d un match :'}</strong>{' '}
                      {isAR
                        ? 'حكم الساحة (يمكن تعيينه كـ : حكم ساحة، حكم رابع، أو VAR) | الحكم المساعد (يمكن تعيينه كـ : حكم مساعد 1/2، أو AVAR).'
                        : 'Arbitre central (désignable comme : Central, 4ème arbitre, VAR) | Arbitre assistant (désignable comme : Assistant 1/2, AVAR).'}
                    </li>
                    <li>
                      <strong>{isAR ? 'نطاق التطبيق :' : 'Champ d application :'}</strong>{' '}
                      {isAR
                        ? 'تطبق تقنيات الوظائف (4ème, VAR, AVAR) حصرياً على المسابقات الوطنية (الرابطة 1، 2، والأولى/الثانية هواة). وتستثنى المسابقات الجهوية والنسائية والشبان.'
                        : 'Les fonctions (4ème, VAR, AVAR) s appliquent uniquement aux compétitions nationales (Ligue I, II, LNA1, LNA2). Les compétitions Régionales, Féminin et Jeunes restent strictement basées sur les rôles de référence.'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Filters & Search for Officials */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={officialSearch}
                    onChange={(e) => setOfficialSearch(e.target.value)}
                    placeholder={isAR ? 'بحث بالاسم، الهوية، البريد...' : 'Rechercher un officiel...'}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">{isAR ? 'الصفة:' : 'Rôle:'}</span>
                    <select
                      value={officialRoleFilter}
                      onChange={(e) => setOfficialRoleFilter(e.target.value)}
                      className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      <option value="ALL">{isAR ? 'جميع الصفات' : 'Tous les rôles'}</option>
                      <option value="REFEREE">{isAR ? 'حكم ساحة' : 'Arbitre Central'}</option>
                      <option value="ASSISTANT_1">{isAR ? 'حكم مساعد' : 'Arbitre Assistant'}</option>
                      <option value="FOURTH">{isAR ? 'حكم رابع' : '4ème Arbitre'}</option>
                      <option value="VAR">{isAR ? 'VAR' : 'VAR'}</option>
                      <option value="AVAR">{isAR ? 'AVAR' : 'AVAR'}</option>
                      <option value="INSPECTOR">{isAR ? 'مراقب' : 'Commissaire'}</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium">{isAR ? 'المسابقة:' : 'Compétition:'}</span>
                    <select
                      value={officialCompFilter}
                      onChange={(e) => setOfficialCompFilter(e.target.value)}
                      className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      <option value="ALL">{isAR ? 'جميع المسابقات' : 'Toutes les compétitions'}</option>
                      {competitions.map((c) => (
                        <option key={c.id} value={c.id}>{c.nameFR} (Rang {c.rank})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Officials Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOfficials.map((off) => {
                  const offCompIds = off.competitionIds || [];
                  return (
                    <div
                      key={off.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-3 hover:border-red-300 dark:hover:border-red-800 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-3 rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 font-bold shrink-0">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {isAR
                                  ? (off.fullNameAR || off.nameAR || off.fullName || `${off.prenom} ${off.nom}`)
                                  : (off.fullName || `${off.prenom} ${off.nom}`)}
                              </h4>
                              {isAR && off.fullName && (
                                <span className="text-xs text-slate-400 font-normal">({off.fullName})</span>
                              )}
                              {!isAR && (off.fullNameAR || off.nameAR) && (
                                <span className="text-xs text-slate-500 font-arabic">({off.fullNameAR || off.nameAR})</span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {off.role}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="font-medium text-amber-700 dark:text-amber-400">{off.grade}</span>
                              <span>•</span>
                              <span>{off.ligueRegionale}</span>
                              {off.cin && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">CIN: {off.cin}</span>
                                </>
                              )}
                            </div>

                            {(off.email || off.telephoneWhatsapp) && (
                              <div className="mt-1 text-[10px] text-slate-400">
                                {off.email} {off.telephoneWhatsapp ? `(${off.telephoneWhatsapp})` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingOfficialId(off.id);
                              setOfficialNom(off.nom || '');
                              setOfficialPrenom(off.prenom || '');
                              setOfficialFullNameAR(off.fullNameAR || off.nameAR || '');
                              setOfficialRole((off.role as OfficialRoleCode) || 'REFEREE');
                              setOfficialLeague(off.ligueRegionale || 'Tunis');
                              setOfficialGrade(off.grade || 'Fédéral');
                              setOfficialCin(off.cin || '');
                              setOfficialPhone(off.telephoneWhatsapp || '');
                              setOfficialEmail(off.email || '');
                              setOfficialBirthDate(off.dateNaissance || '');
                              setOfficialCompAppartenance(off.competitionAppartenance || 'Ligue I (Professionnelle)');
                              setOfficialCompIds(off.competitionIds || ['comp_l1']);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOfficial(off.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display Associated Authorized Competitions (Relation Officiel ↔ Compétition) */}
                      <div className="border-t border-slate-100 dark:border-slate-700/60 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {isAR ? 'المسابقات المأذون بها للرسمي:' : 'Compétitions habilitées :'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleAllCompetitionsToOfficial(off.id, true)}
                              className="text-[10px] text-red-600 hover:underline font-semibold"
                            >
                              {isAR ? 'تحديد الكل' : 'Tout cocher'}
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => handleToggleAllCompetitionsToOfficial(off.id, false)}
                              className="text-[10px] text-slate-400 hover:underline"
                            >
                              {isAR ? 'مسح' : 'Effacer'}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {competitions.map((comp) => {
                            const isSelected = offCompIds.includes(comp.id);
                            return (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => handleToggleCompetitionForOfficial(off.id, comp.id)}
                                title={`${comp.nameFR} (Rang ${comp.rank})`}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                                    : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                {comp.abbreviation || comp.nameFR.slice(0, 4)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: EXAM LEVELS */}
          {activeSubTab === 'EXAMS' && (
            <div className="space-y-6">
              <form onSubmit={handleAddExamLevel} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <span>{isAR ? 'إضافة مستوى امتحان تطبيقي' : 'Nouveau Niveau d Examen Pratique'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'المسمى بالفرنسية' : 'Intitulé (Français)'}</label>
                    <input
                      type="text"
                      required
                      value={newExamFR}
                      onChange={(e) => setNewExamFR(e.target.value)}
                      placeholder="Ex: Examen Fédéral"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{isAR ? 'المسمى بالعربية' : 'Intitulé (Arabe)'}</label>
                    <input
                      type="text"
                      required
                      value={newExamAR}
                      onChange={(e) => setNewExamAR(e.target.value)}
                      placeholder="مثال: امتحان فيدرالي"
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAR ? 'إضافة المستوى' : 'Ajouter le Niveau'}</span>
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {examLevels.map((lvl) => (
                  <div key={lvl.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500 text-white font-bold">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-200">{lvl.nameFR}</div>
                        <div className="text-[11px] text-amber-800/80 font-arabic">{lvl.nameAR}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteExamLevel(lvl.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRITERIA */}
          {activeSubTab === 'CRITERIA' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                {[
                  { id: 'PERSONALITY', labelFR: 'Personnalité', labelAR: 'الشخصية' },
                  { id: 'PHYSICAL', labelFR: 'Physique & Placement', labelAR: 'البدني والتمركز' },
                  { id: 'LAWS', labelFR: 'Lois du Jeu', labelAR: 'قوانين اللعبة' },
                  { id: 'ASSISTANTS', labelFR: 'Assistants', labelAR: 'الحكام المساعدون' },
                  { id: 'FOURTH', labelFR: '4ème Arbitre', labelAR: 'الحكم الرابع' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCritCat(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      critCat === cat.id
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isAR ? cat.labelAR : cat.labelFR}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddCriterion} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{isAR ? 'إضافة معيار تقييم جديد' : 'Ajouter un Critère d Évaluation'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={critFR}
                    onChange={(e) => setCritFR(e.target.value)}
                    placeholder="Libellé en français..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    required
                    value={critAR}
                    onChange={(e) => setCritAR(e.target.value)}
                    placeholder="النص بالعربية..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-arabic"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAR ? 'إضافة' : 'Ajouter'}</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {criteria.filter((c) => c.categoryId === critCat).map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{item.textFR}</div>
                      <div className="text-slate-500 font-arabic">{item.textAR}</div>
                    </div>
                    <button onClick={() => handleDeleteCriterion(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DNA AXES & COEFFICIENTS */}
          {activeSubTab === 'DNA_AXES' && (
            <div className="space-y-6">
              {/* Info Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start gap-3 text-xs">
                <Sliders className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200">
                    {isAR ? 'إدارة محاور التقييم والمعاملات الترجيحية (DNA Barème) :' : 'Gestion des Axes d\'Évaluation & Coefficients DNA :'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {isAR
                      ? 'يمكنك من هنا تعديل معاملات الترجيح (المعاملات)، تفعيل أو إلغاء تفعيل أي محور، أو إضافة محاور جديدة (مثل VAR أو التواصل). تتغير معادلة التقييم التلقائية فورياً وتنعكس على جميع التقارير الجديدة.'
                      : 'Modifiez librement les coefficients (Pondération), activez/désactivez des axes ou ajoutez de nouveaux axes (ex: VAR, Communication). La formule mathématique s\'adapte dynamiquement.'}
                  </p>
                </div>
              </div>

              {/* Dynamic Formula Display */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center md:text-start">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {isAR ? 'المعادلة المعتمدة حالياً' : 'Formule de calcul en vigueur'}
                  </span>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {calculateDynamicRefereeScore({}, dnaAxes, lang).formulaStrFR}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(isAR ? 'هل تريد إعادة تعيين المحاور للمعايير الأصلية؟' : 'Réinitialiser les axes aux valeurs par défaut DNA ?')) {
                      const defs = resetToDefaultDnaAxes();
                      setDnaAxes(defs);
                      showNotice(isAR ? 'تم إعادة التعيين بنجاح' : 'Réinitialisation effectuée !');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAR ? 'إعادة التعيين' : 'Réinitialiser Barèmes'}</span>
                </button>
              </div>

              {/* Axes Cards Grid */}
              <div className="grid grid-cols-1 gap-4">
                {dnaAxes.map((axis, idx) => (
                  <div
                    key={axis.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      axis.isActive
                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {axis.titleFR}
                            </h4>
                            <span className="text-xs text-slate-500 font-arabic font-medium">
                              ({axis.titleAR})
                            </span>
                          </div>
                          {axis.descriptionFR && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {isAR ? axis.descriptionAR || axis.descriptionFR : axis.descriptionFR}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Coefficient Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {isAR ? 'المعامل :' : 'Coef :'}
                          </span>
                          <select
                            value={axis.coefficient}
                            onChange={(e) => {
                              const newCoef = parseInt(e.target.value) || 1;
                              const updated = dnaAxes.map((a) =>
                                a.id === axis.id ? { ...a, coefficient: newCoef } : a
                              );
                              setDnaAxes(updated);
                              saveStoredDnaAxes(updated);
                              showNotice(isAR ? 'تم تحديث المعامل' : 'Coefficient mis à jour !');
                            }}
                            className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-mono font-black text-xs px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 focus:outline-none"
                          >
                            <option value={1}>×1</option>
                            <option value={2}>×2</option>
                            <option value={3}>×3</option>
                            <option value={4}>×4</option>
                            <option value={5}>×5</option>
                          </select>
                        </div>

                        {/* Active Toggle */}
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <input
                            type="checkbox"
                            checked={axis.isActive}
                            onChange={(e) => {
                              const updated = dnaAxes.map((a) =>
                                a.id === axis.id ? { ...a, isActive: e.target.checked } : a
                              );
                              setDnaAxes(updated);
                              saveStoredDnaAxes(updated);
                              showNotice(
                                e.target.checked
                                  ? (isAR ? 'تم تفعيل المحور' : 'Axe activé !')
                                  : (isAR ? 'تم تعطيل المحور' : 'Axe désactivé !')
                              );
                            }}
                            className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
                          />
                          <span className={axis.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                            {axis.isActive ? (isAR ? 'نشط' : 'Actif') : (isAR ? 'معطل' : 'Inactif')}
                          </span>
                        </label>

                        {!axis.isBuiltIn && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(isAR ? 'حذف هذا المحور؟' : 'Supprimer cet axe ?')) {
                                const updated = dnaAxes.filter((a) => a.id !== axis.id);
                                setDnaAxes(updated);
                                saveStoredDnaAxes(updated);
                                showNotice(isAR ? 'تم الحذف' : 'Axe supprimé !');
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Custom Axis Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>{isAR ? 'إضافة محور تقييم جديد (مثل: VAR أو التواصل)' : 'Ajouter un Nouvel Axe d Évaluation (ex: VAR, Communication)'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    id="newAxisTitleFR"
                    placeholder="Nom de l axe (FR)... ex: Assistance Vidéo VAR"
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    id="newAxisTitleAR"
                    placeholder="اسم المحور (بالعربية)... مثل: تقنية تقصي الفيديو"
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-arabic"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const inputFR = (document.getElementById('newAxisTitleFR') as HTMLInputElement)?.value.trim();
                      const inputAR = (document.getElementById('newAxisTitleAR') as HTMLInputElement)?.value.trim();

                      if (!inputFR || !inputAR) {
                        alert(isAR ? 'الرجاء إدخال الاسم بالفرنسية والعربية' : 'Veuillez saisir les noms FR et AR');
                        return;
                      }

                      const newAxis: DnaEvaluationAxis = {
                        id: `axis_${Date.now()}`,
                        code: `AXIS_${Date.now().toString().slice(-4)}`,
                        titleFR: inputFR,
                        titleAR: inputAR,
                        descriptionFR: 'Axe personnalisé de la DNA',
                        descriptionAR: 'محور مخصص من الإدارة الوطنية',
                        coefficient: 1,
                        isActive: true,
                        displayOrder: dnaAxes.length + 1,
                        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
                        isBuiltIn: false,
                      };

                      const updated = [...dnaAxes, newAxis];
                      setDnaAxes(updated);
                      saveStoredDnaAxes(updated);

                      (document.getElementById('newAxisTitleFR') as HTMLInputElement).value = '';
                      (document.getElementById('newAxisTitleAR') as HTMLInputElement).value = '';

                      showNotice(isAR ? 'تم إضافة المحور الجديد' : 'Nouvel axe créé avec succès !');
                    }}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAR ? 'إضافة المحور' : 'Créer cet Axe'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{isAR ? 'تم حفظ التعديلات في النظام المحلي' : 'Données de paramétrage synchronisées'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl cursor-pointer"
          >
            {isAR ? 'إغلاق النافذة' : 'Fermer le Paramétrage'}
          </button>
        </div>

      </div>
    </div>
  );
};
