import React, { useState, useEffect } from 'react';
import { FullReport, Language, MatchOfficial, OfficialRole } from '../../types';
import { LEAGUES_LIST, GRADES_LIST } from '../../data/mockData';
import {
  getStoredOfficials,
  getEligibleOfficialsForMatchFunction,
  isNationalCompetitionWithAdvancedRoles,
  OfficialFullRecord,
} from '../../data/officialsDatabase';
import { SearchableSelect, SearchableOption } from '../common/SearchableSelect';
import { Users, ShieldCheck, Info, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

interface OfficialsSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const OfficialsSection: React.FC<OfficialsSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [dbOfficials, setDbOfficials] = useState<OfficialFullRecord[]>([]);

  useEffect(() => {
    setDbOfficials(getStoredOfficials());
  }, [report.competition]);

  const isNational = isNationalCompetitionWithAdvancedRoles(report.competition);

  const ALL_OFFICIAL_ROLES: {
    role: OfficialRole;
    labelFR: string;
    labelAR: string;
    badge: string;
    allowedBaseRolesFR: string;
    allowedBaseRolesAR: string;
    isAdvancedFunction?: boolean;
  }[] = [
    {
      role: 'REFEREE',
      labelFR: 'Arbitre Central',
      labelAR: 'حكم الساحة الرئيسي',
      badge: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900',
      allowedBaseRolesFR: 'Rôle requis : Arbitre Central',
      allowedBaseRolesAR: 'الصفة المطلوبة: حكم ساحة',
    },
    {
      role: 'ASSISTANT_1',
      labelFR: '1er Assistant',
      labelAR: 'الحكم المساعد الأول',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      allowedBaseRolesFR: 'Rôle requis : Arbitre Assistant',
      allowedBaseRolesAR: 'الصفة المطلوبة: حكم مساعد',
    },
    {
      role: 'ASSISTANT_2',
      labelFR: '2ème Assistant',
      labelAR: 'الحكم المساعد الثاني',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      allowedBaseRolesFR: 'Rôle requis : Arbitre Assistant',
      allowedBaseRolesAR: 'الصفة المطلوبة: حكم مساعد',
    },
    {
      role: 'FOURTH',
      labelFR: '4ème Officiel',
      labelAR: 'الحكم الرابع',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      allowedBaseRolesFR: 'Fonction accessible aux : Arbitres Centraux',
      allowedBaseRolesAR: 'متاحة لحكام الساحة',
      isAdvancedFunction: true,
    },
    {
      role: 'VAR',
      labelFR: 'Arbitre VAR',
      labelAR: 'حكم تقنية الفيديو (VAR)',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      allowedBaseRolesFR: 'Fonction accessible aux : Arbitres Centraux',
      allowedBaseRolesAR: 'متاحة لحكام الساحة',
      isAdvancedFunction: true,
    },
    {
      role: 'AVAR',
      labelFR: 'Assistant VAR',
      labelAR: 'مساعد حكم الفيديو (AVAR)',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      allowedBaseRolesFR: 'Fonction accessible aux : Arbitres Assistants',
      allowedBaseRolesAR: 'متاحة للحكام المساعدين',
      isAdvancedFunction: true,
    },
    {
      role: 'INSPECTOR',
      labelFR: 'Commissaire / Inspecteur',
      labelAR: 'مراقب / متفقد الحكام',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      allowedBaseRolesFR: 'Rôle requis : Commissaire / Examinateur',
      allowedBaseRolesAR: 'الصفة المطلوبة: مراقب / مقيم',
    },
  ];

  // Filter roles based on whether the competition is national or non-national
  const visibleRoles = ALL_OFFICIAL_ROLES.filter((r) => {
    if (!r.isAdvancedFunction) return true;
    return isNational;
  });

  const getOfficial = (role: OfficialRole) => {
    return (
      report.officials.find((o) => o.role === role) || {
        id: '',
        role,
        name: '',
        league: 'Tunis',
        grade: 'Fédéral',
      }
    );
  };

  const handleSelectOfficialFromDb = (role: OfficialRole, selectedObj: OfficialFullRecord) => {
    const officialName = selectedObj.fullName || `${selectedObj.prenom} ${selectedObj.nom}`;
    const officialNameAR = selectedObj.fullNameAR || selectedObj.nameAR;

    const updated = report.officials.map((off) => {
      if (off.role === role) {
        return {
          ...off,
          name: officialName,
          nameAR: officialNameAR || off.nameAR,
          league: selectedObj.ligueRegionale || off.league,
          grade: selectedObj.grade || off.grade,
        };
      }
      return off;
    });

    if (!report.officials.some((o) => o.role === role)) {
      const newOfficial: MatchOfficial = {
        id: `off_${Date.now()}_${Math.random()}`,
        role,
        name: officialName,
        nameAR: officialNameAR,
        league: selectedObj.ligueRegionale || LEAGUES_LIST[0].nameFR,
        grade: selectedObj.grade || GRADES_LIST[0].nameFR,
      };
      updated.push(newOfficial);
    }

    onChange({ officials: updated });
  };

  const handleOfficialChange = (role: OfficialRole, key: keyof MatchOfficial, value: string) => {
    const updated = report.officials.map((off) => {
      if (off.role === role) {
        return { ...off, [key]: value };
      }
      return off;
    });

    if (!report.officials.some((o) => o.role === role)) {
      const newOfficial: MatchOfficial = {
        id: `off_${Date.now()}_${Math.random()}`,
        role,
        name: key === 'name' ? value : '',
        league: key === 'league' ? value : LEAGUES_LIST[0].nameFR,
        grade: key === 'grade' ? value : GRADES_LIST[0].nameFR,
      };
      updated.push(newOfficial);
    }

    onChange({ officials: updated });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'طاقم التحكيم ومراقب المباراة' : 'Désignation des Officiels de la Rencontre'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAR
                ? 'تحديد أسماء ووظائف الحكام والمراقب حسب المسابقة وتطبيق قاعدة عدم التكرار'
                : 'Sélection des officiels avec moteur de recherche intégrée & règle d\'unicité'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>{report.competition || (isAR ? 'مسابقة عامة' : 'Compétition')}</span>
          </span>
        </div>
      </div>

      {/* Rules Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-slate-100">
            {isAR
              ? 'قواعد اختيار الوظائف والتراخيص وقاعدة عدم التكرار :'
              : 'Règles de désignation, habilitations & règle d\'unicité :'}
          </div>
          <p className="text-[11px] leading-relaxed">
            {isAR
              ? 'تتضمن كل قائمة محرك بحث ذكي للبحث بالاسم أو الدرجة. يمنع تعيين نفس الحكم لأكثر من وظيفة في نفس التقرير (يتم استبعاده تلقائياً من باقي القوائم فور اختياره).'
              : 'Chaque liste dispose d\'un moteur de recherche. La règle d\'unicité garantit qu\'un officiel désigné pour un rôle est automatiquement exclu des autres rôles du même rapport.'}
          </p>
        </div>
      </div>

      {/* Grid of Official Designation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleRoles.map(({ role, labelFR, labelAR, badge, allowedBaseRolesFR, allowedBaseRolesAR }) => {
          const off = getOfficial(role);

          // Get candidate list automatically filtered by match function & competition eligibility
          const eligibleCandidates = getEligibleOfficialsForMatchFunction(
            dbOfficials,
            role,
            report.competition
          );

          // Rule 2: Official Uniqueness Constraint
          // Get list of assigned official names in OTHER roles in this report
          const assignedInOtherRoles = report.officials
            .filter((o) => o.role !== role && o.name && o.name.trim() !== '')
            .map((o) => o.name.trim().toLowerCase());

          // Filter out candidates already assigned elsewhere in this report
          const availableCandidates = eligibleCandidates.filter((cand) => {
            const name1 = (cand.fullName || '').toLowerCase().trim();
            const name2 = `${cand.prenom} ${cand.nom}`.toLowerCase().trim();
            return !assignedInOtherRoles.includes(name1) && !assignedInOtherRoles.includes(name2);
          });

          // Convert available candidates to SearchableOptions
          const candidateOptions: SearchableOption[] = availableCandidates.map((cand) => {
            const displayNameFR = cand.fullName || `${cand.prenom} ${cand.nom}`;
            const displayNameAR = cand.fullNameAR || cand.nameAR || displayNameFR;
            return {
              id: cand.id,
              labelFR: displayNameFR,
              labelAR: displayNameAR,
              subLabel: `${cand.ligueRegionale} — ${cand.grade} (${cand.competitionAppartenance || cand.role})`,
              badge: cand.grade,
              searchTokens: [
                cand.nom,
                cand.prenom,
                cand.fullNameAR || '',
                cand.nameAR || '',
                cand.ligueRegionale,
                cand.grade,
                cand.role
              ],
              rawObject: cand,
            };
          });

          // Check if current typed name matches any candidate
          const matchedDbOfficial = dbOfficials.find(
            (o) =>
              (o.fullName && o.fullName.toLowerCase() === off.name.toLowerCase()) ||
              (`${o.prenom} ${o.nom}`.toLowerCase() === off.name.toLowerCase()) ||
              (o.fullNameAR && o.fullNameAR === off.nameAR) ||
              (o.nameAR && o.nameAR === off.nameAR)
          );

          return (
            <div
              key={role}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 space-y-3 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${badge}`}>
                  {isAR ? labelAR : labelFR}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isAR ? allowedBaseRolesAR : allowedBaseRolesFR}
                </span>
              </div>

              {/* Searchable Dropdown Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{isAR ? 'اختيار الحكم المعين (مع محرك بحث)' : 'Sélectionner l\'officiel (recherche) :'}</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    {availableCandidates.length} {isAR ? 'متاح' : 'disponible(s)'}
                  </span>
                </label>

                <SearchableSelect
                  options={candidateOptions}
                  value={isAR ? (off.nameAR || off.name) : off.name}
                  onChange={(val, opt) => {
                    if (opt?.rawObject) {
                      handleSelectOfficialFromDb(role, opt.rawObject as OfficialFullRecord);
                    } else {
                      handleOfficialChange(role, isAR ? 'nameAR' : 'name', val);
                    }
                  }}
                  placeholder={
                    isAR
                      ? `-- ابحث واختر الحكم (${availableCandidates.length} متاح) --`
                      : `-- Rechercher un officiel (${availableCandidates.length} dispo) --`
                  }
                  searchPlaceholder={
                    isAR ? 'أدخل اسم الحكم أو لجنته أو درجاته...' : 'Prénom, nom, ligue, grade...'
                  }
                  lang={lang}
                  allowCustom={true}
                />
              </div>

              {/* Arabic Name Input Field */}
              <div>
                <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1">
                  {isAR ? 'الاسم واللقب بالعربية (للتقرير العربي)' : 'Nom et Prénom en arabe (pour rapport AR) :'}
                </label>
                <input
                  type="text"
                  value={off.nameAR || ''}
                  onChange={(e) => handleOfficialChange(role, 'nameAR', e.target.value)}
                  placeholder="مثال: نعيم حسني"
                  dir="rtl"
                  className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Manual Name Input Status Indicator */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">
                  {isAR ? 'حالة الاعتماد القانوني :' : 'Statut d\'habilitation :'}
                </span>
                {matchedDbOfficial ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isAR ? 'معتمد ومسجل بقاعدة البيانات' : 'Profil officiel habilité'}</span>
                  </span>
                ) : off.name.trim() ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{isAR ? 'إدخال يدوي حر' : 'Saisie libre (Hors BD)'}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 italic">
                    {isAR ? 'لم يتم الاختيار بعد' : 'Non désigné'}
                  </span>
                )}
              </div>

              {/* League, Grade, and Difficulty */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {isAR ? 'الرابطة الجهوية' : 'Ligue Régionale'}
                  </label>
                  <select
                    value={off.league}
                    onChange={(e) => handleOfficialChange(role, 'league', e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {LEAGUES_LIST.map((l) => (
                      <option key={l.id} value={l.nameFR}>
                        {isAR ? l.nameAR : l.nameFR}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {isAR ? 'الدرجة' : 'Grade'}
                  </label>
                  <select
                    value={off.grade}
                    onChange={(e) => handleOfficialChange(role, 'grade', e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {GRADES_LIST.map((g) => (
                      <option key={g.id} value={g.nameFR}>
                        {isAR ? g.nameAR : g.nameFR}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-0.5">
                    {isAR ? 'درجة الصعوبة' : 'Degré de difficulté'}
                  </label>
                  <select
                    value={off.difficultyLevel || report.difficultyLevel || 'MOYENNE'}
                    onChange={(e) => handleOfficialChange(role, 'difficultyLevel', e.target.value as any)}
                    className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                  >
                    <option value="FACILE">{isAR ? 'سهلة (Facile)' : 'Facile'}</option>
                    <option value="MOYENNE">{isAR ? 'متوسطة (Moyenne)' : 'Moyenne'}</option>
                    <option value="ELEVEE">{isAR ? 'عالية (Élevée)' : 'Élevée'}</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
