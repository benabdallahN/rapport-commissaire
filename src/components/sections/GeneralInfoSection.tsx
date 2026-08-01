import React, { useState, useEffect } from 'react';
import { FullReport, Language } from '../../types';
import { DIFFICULTY_LEVELS } from '../../data/mockData';
import {
  getStoredCompetitions,
  getClubsForCompetition,
  isCompetitionFreeText,
  CompetitionItem,
  ClubItem,
} from '../../data/competitionsAndClubsData';
import {
  getStoredStadiums,
  getStadiumsForCompetition,
  StadiumItem,
} from '../../data/stadiumsData';
import { StadiumsSettingsModal } from '../settings/StadiumsSettingsModal';
import { SearchableSelect, SearchableOption } from '../common/SearchableSelect';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ShieldAlert,
  Settings,
  UserCheck,
  Building2,
  Sparkles,
  Info,
} from 'lucide-react';

interface GeneralInfoSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';

  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);
  const [stadiums, setStadiums] = useState<StadiumItem[]>([]);
  const [availableClubs, setAvailableClubs] = useState<ClubItem[]>([]);
  
  const [isStadiumsModalOpen, setIsStadiumsModalOpen] = useState(false);
  const [isManualStadium, setIsManualStadium] = useState(false);

  const isFreeText = isCompetitionFreeText(report.competition);

  const reloadData = () => {
    const comps = getStoredCompetitions();
    setCompetitions(comps);

    const stads = getStadiumsForCompetition(report.competition);
    setStadiums(stads);

    const clubs = getClubsForCompetition(report.competition);
    setAvailableClubs(clubs);
  };

  useEffect(() => {
    reloadData();
  }, [report.competition]);

  const handleCompetitionChange = (selectedCompName: string) => {
    onChange({ competition: selectedCompName });
    const freeMode = isCompetitionFreeText(selectedCompName);
    if (freeMode) {
      setIsManualStadium(true);
    } else {
      setIsManualStadium(false);
    }
  };

  const handleSelectStadium = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setIsManualStadium(true);
      return;
    }

    setIsManualStadium(false);
    if (!val) {
      onChange({ stadium: '' });
      return;
    }

    const found = stadiums.find(
      (s) => s.nameFR === val || s.nameAR === val || `${s.nameFR} | ${s.nameAR}` === val
    );

    if (found) {
      const selectedName = isAR ? found.nameAR : found.nameFR;
      const selectedCity = isAR ? found.cityAR || found.cityFR : found.cityFR || found.cityAR;
      onChange({
        stadium: selectedName,
        city: selectedCity || report.city,
      });
    } else {
      onChange({ stadium: val });
    }
  };

  // Rule 1: Team Uniqueness Constraint
  // Team A options exclude Team B if Team B is selected
  const teamAOptions: SearchableOption[] = availableClubs
    .filter((c) => {
      if (!report.teamB) return true;
      const bName = report.teamB.trim().toLowerCase();
      return (
        c.nameFR.toLowerCase() !== bName &&
        c.nameAR.toLowerCase() !== bName &&
        (c.abbr ? c.abbr.toLowerCase() !== report.teamBAbbr.trim().toLowerCase() : true)
      );
    })
    .map((c) => ({
      id: c.id,
      labelFR: c.nameFR,
      labelAR: c.nameAR,
      abbr: c.abbr,
      searchTokens: [c.nameFR, c.nameAR, c.abbr],
    }));

  // Team B options exclude Team A if Team A is selected
  const teamBOptions: SearchableOption[] = availableClubs
    .filter((c) => {
      if (!report.teamA) return true;
      const aName = report.teamA.trim().toLowerCase();
      return (
        c.nameFR.toLowerCase() !== aName &&
        c.nameAR.toLowerCase() !== aName &&
        (c.abbr ? c.abbr.toLowerCase() !== report.teamAAbbr.trim().toLowerCase() : true)
      );
    })
    .map((c) => ({
      id: c.id,
      labelFR: c.nameFR,
      labelAR: c.nameAR,
      abbr: c.abbr,
      searchTokens: [c.nameFR, c.nameAR, c.abbr],
    }));

  const handleSelectTeamA = (val: string, opt?: SearchableOption) => {
    if (!val) {
      onChange({ teamA: '', teamAAbbr: '' });
      return;
    }
    const club = availableClubs.find(
      (c) => c.id === opt?.id || c.nameFR === val || c.nameAR === val
    );
    if (club) {
      onChange({
        teamA: isAR ? club.nameAR : club.nameFR,
        teamAAbbr: club.abbr,
      });
    } else {
      onChange({ teamA: val });
    }
  };

  const handleSelectTeamB = (val: string, opt?: SearchableOption) => {
    if (!val) {
      onChange({ teamB: '', teamBAbbr: '' });
      return;
    }
    const club = availableClubs.find(
      (c) => c.id === opt?.id || c.nameFR === val || c.nameAR === val
    );
    if (club) {
      onChange({
        teamB: isAR ? club.nameAR : club.nameFR,
        teamBAbbr: club.abbr,
      });
    } else {
      onChange({ teamB: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'معلومات المباراة والمسابقة' : 'Informations Générales du Match'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAR
                ? 'حدّد تفاصيل المسابقة والفرق والتوقيت والملعب والنتيجة النهائية'
                : 'Saisissez les détails de la rencontre, le terrain, les équipes et les scores'}
            </p>
          </div>
        </div>

        {/* Free Text Mode Banner Notice for Particular Competitions */}
        {isFreeText && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isAR
                ? 'مسابقة خاصة (الرابطة الجهوية / الكرة النسائية / الشبان): تم تفعيل خيار الساهية الحرة للملعب والمدينة والفرق بشكل مباشر.'
                : 'Compétition à cas particulier (Ligue Régionale / Féminin / Jeunes) : Les champs Équipes, Stade et Ville sont en saisie libre.'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Season & Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'الموسم الرياضي' : 'Saison Sportive'}
            </label>
            <input
              type="text"
              value={report.season}
              onChange={(e) => onChange({ season: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="2025-2026"
            />
          </div>

          {/* Competition Filtered */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'المسابقة / البطولة' : 'Compétition'}
            </label>
            <select
              value={report.competition}
              onChange={(e) => handleCompetitionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.nameFR}>
                  {isAR ? `${comp.nameAR} (${comp.type})` : `${comp.nameFR} (${comp.type})`}
                </option>
              ))}
            </select>
          </div>

          {/* Match Day / Journee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'الجولة / الدور' : 'Journée / Tour'}
            </label>
            <input
              type="text"
              value={report.matchDay}
              onChange={(e) => onChange({ matchDay: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="J14 / 1/8è Final"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'درجة الصعوبة' : 'Degré de difficulté'}
            </label>
            <select
              value={report.difficultyLevel}
              onChange={(e) => onChange({ difficultyLevel: e.target.value as any })}
              className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.id} value={d.id}>
                  {isAR ? d.nameAR : d.nameFR}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{isAR ? 'تاريخ المباراة' : 'Date du Match'}</span>
            </label>
            <input
              type="date"
              value={report.matchDate}
              onChange={(e) => onChange({ matchDate: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{isAR ? 'توقيت انطلاق المباراة' : 'Heure de Coup d\'Envoi'}</span>
            </label>
            <input
              type="time"
              value={report.matchTime}
              onChange={(e) => onChange({ matchTime: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Stadium */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{isAR ? 'الملعب' : 'Stade'}</span>
              </label>
              
              {!isFreeText && (
                <button
                  type="button"
                  onClick={() => setIsStadiumsModalOpen(true)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  title="Gérer la liste paramétrable des stades"
                >
                  <Settings className="w-3 h-3" />
                  <span>{isAR ? 'إدارة الملاعب' : 'Paramétrer'}</span>
                </button>
              )}
            </div>

            {!isFreeText && !isManualStadium ? (
              <select
                value={report.stadium}
                onChange={handleSelectStadium}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">
                  {isAR ? '-- اختر الملعب المعين للمسابقة --' : '-- Sélectionner un stade homologué --'}
                </option>
                {stadiums.map((st) => (
                  <option key={st.id} value={isAR ? st.nameAR : st.nameFR}>
                    {isAR ? `${st.nameAR} (${st.nameFR})` : `${st.nameFR} — ${st.nameAR}`}
                  </option>
                ))}
                <option value="__CUSTOM__">
                  {isAR ? '✍️ ملعب آخر (إدخال يدوي)' : '✍️ Autre stade (Saisie libre)'}
                </option>
              </select>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={report.stadium}
                  onChange={(e) => onChange({ stadium: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  placeholder={isAR ? 'أدخل اسم الملعب مباشرة...' : 'Saisie libre du Stade...'}
                />
                {!isFreeText && (
                  <button
                    type="button"
                    onClick={() => setIsManualStadium(false)}
                    className="absolute right-2 top-2 text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    {isAR ? 'العودة للقائمة' : 'Retour à la liste'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'المدينة / الولاية' : 'Ville / Gouvernorat'}
            </label>
            <input
              type="text"
              value={report.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tunis / Sousse / Sfax"
            />
          </div>

        </div>
      </div>

      {/* Teams & Scores Block with Searchable Selection and Uniqueness Constraint */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>{isAR ? 'الفريقان والنتائج المسجلة' : 'Les Équipes et les Scores'}</span>
          </h3>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {isAR ? 'بحث بالاسم أو التلخيص (EST, CA...) | يمنع تكرار الفريق' : 'Recherche par nom / abréviation | Unicité garantie'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Team A (Recevante / Domicile) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                {isAR ? 'الفريق (أ) - المضيف' : 'Équipe A (Domicile)'}
              </span>
              <input
                type="text"
                value={report.teamAAbbr}
                onChange={(e) => onChange({ teamAAbbr: e.target.value })}
                className="w-20 px-2 py-0.5 text-xs text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                placeholder="CA / EST"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {isAR ? 'اختيار الفريق المستضيف (مع محرك بحث)' : 'Sélectionner l\'équipe recevante (recherche intégrée) :'}
              </label>
              <SearchableSelect
                options={teamAOptions}
                value={report.teamA}
                onChange={handleSelectTeamA}
                placeholder={isAR ? 'ابحث عن الفريق (EST, CA...)' : 'Rechercher un club (EST, CA...)'}
                searchPlaceholder={isAR ? 'أدخل اسم الفريق أو رمزه...' : 'Nom, symbole (EST, CA, CSS)...'}
                lang={lang}
                allowCustom={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                  {isAR ? 'الشوط الأول' : 'Score 1er MT'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={report.scoreHalfA}
                  onChange={(e) => onChange({ scoreHalfA: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-center text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-0.5">
                  {isAR ? 'النتيجة النهائية' : 'Score Final'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={report.scoreFinalA}
                  onChange={(e) => onChange({ scoreFinalA: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-center text-md font-bold rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                />
              </div>
            </div>
          </div>

          {/* Team B (Visiteuse) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isAR ? 'الفريق (ب) - الضيف' : 'Équipe B (Visiteur)'}
              </span>
              <input
                type="text"
                value={report.teamBAbbr}
                onChange={(e) => onChange({ teamBAbbr: e.target.value })}
                className="w-20 px-2 py-0.5 text-xs text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                placeholder="EST / ST"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {isAR ? 'اختيار الفريق الزائر (مع محرك بحث)' : 'Sélectionner l\'équipe visiteuse (recherche intégrée) :'}
              </label>
              <SearchableSelect
                options={teamBOptions}
                value={report.teamB}
                onChange={handleSelectTeamB}
                placeholder={isAR ? 'ابحث عن الفريق (CSS, ESS...)' : 'Rechercher un club (CSS, ESS...)'}
                searchPlaceholder={isAR ? 'أدخل اسم الفريق أو رمزه...' : 'Nom, symbole (ESS, ST, CSS)...'}
                lang={lang}
                allowCustom={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                  {isAR ? 'الشوط الأول' : 'Score 1er MT'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={report.scoreHalfB}
                  onChange={(e) => onChange({ scoreHalfB: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-center text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-0.5">
                  {isAR ? 'النتيجة النهائية' : 'Score Final'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={report.scoreFinalB}
                  onChange={(e) => onChange({ scoreFinalB: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-center text-md font-bold rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Commissioner Author Block (Individual Independent Report) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">
              {isAR ? 'معد التقرير (مراقب المباراة)' : 'Commissaire Auteur du Rapport'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {isAR ? 'تقرير مستقل معرّف برمز فردي' : 'Rapport autonome indépendant'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              {isAR ? 'اسم ولقب مراقب المباراة' : 'Nom & Prénom du Commissaire'}
            </label>
            <input
              type="text"
              value={report.commissaireName}
              onChange={(e) => onChange({ commissaireName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100"
              placeholder="Nom du Commissaire..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              {isAR ? 'البريد الإلكتروني' : 'Adresse Email du Commissaire'}
            </label>
            <input
              type="email"
              value={report.commissaireEmail}
              onChange={(e) => onChange({ commissaireEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-slate-100"
              placeholder="commissaire@ftf.org.tn"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {isAR
              ? 'في حالة تعيين مراقبين اثنين لنفس المباراة (تقييم أو امتحان تطبيقي)، يقوم كل مراقب بإعداد تقريره الخاص بشكل مستقل تام. يحصل كل تقرير على رمز معرف فريد خاص به ويتم ربطه بالمباراة.'
              : 'En cas de désignation de 2 commissaires pour un même match, chacun établit son propre rapport autonome. Les 2 rapports sont enregistrés séparément sous leurs ID autonomes et rattachés au même match.'}
          </p>
        </div>
      </div>

      {/* Paramétrage des Stades Modal */}
      <StadiumsSettingsModal
        isOpen={isStadiumsModalOpen}
        onClose={() => setIsStadiumsModalOpen(false)}
        lang={lang}
        onStadiumsUpdated={reloadData}
      />
    </div>
  );
};
