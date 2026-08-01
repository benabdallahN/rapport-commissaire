import React, { useState } from 'react';
import { FullReport, Language, UserRole } from '../types';
import { exportReportToPdf } from '../utils/pdfExporter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  BarChart3,
  Search,
  FileText,
  Download,
  Trash2,
  Edit,
  Award,
  ShieldAlert,
  Users,
  CheckCircle2,
  User,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  Building,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  reports: FullReport[];
  onSelectReport: (report: FullReport) => void;
  onDeleteReport: (id: string) => void;
  lang: Language;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenOfficialsTable: () => void;
  onOpenCriteriaSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  lang,
  userRole,
  onRoleChange,
  onOpenOfficialsTable,
  onOpenCriteriaSettings,
}) => {
  const isAR = lang === 'AR';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stats calculation
  const totalReports = reports.length;
  const avgScore = totalReports > 0
    ? (reports.reduce((acc, r) => acc + r.calculatedRefereeScore, 0) / totalReports).toFixed(2)
    : '0.00';
  const totalCards = reports.reduce((acc, r) => acc + r.cards.length, 0);
  const validatedCount = reports.filter((r) => r.status === 'VALIDATED').length;

  // Chart data 1: Score distribution
  const scoreBrackets = [
    { name: '9.0 - 10.0', count: reports.filter((r) => r.calculatedRefereeScore >= 9.0).length },
    { name: '8.5 - 8.9', count: reports.filter((r) => r.calculatedRefereeScore >= 8.5 && r.calculatedRefereeScore < 9.0).length },
    { name: '8.3 - 8.4', count: reports.filter((r) => r.calculatedRefereeScore >= 8.3 && r.calculatedRefereeScore < 8.5).length },
    { name: '8.0 - 8.2', count: reports.filter((r) => r.calculatedRefereeScore >= 8.0 && r.calculatedRefereeScore < 8.3).length },
    { name: '< 8.0', count: reports.filter((r) => r.calculatedRefereeScore < 8.0).length },
  ];

  // Arbitre evolution data (J1 to J15)
  const refereeEvolutionData = [
    { matchDay: 'J01', score: 8.2 },
    { matchDay: 'J03', score: 8.3 },
    { matchDay: 'J06', score: 8.1 },
    { matchDay: 'J09', score: 8.4 },
    { matchDay: 'J12', score: 8.2 },
    { matchDay: 'J14', score: 8.37 },
  ];

  // Filtering reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.commissaireName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Role Mode Switcher */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {isAR ? 'لوحة التحكم التخصصیة حسب المستخدم' : 'Tableau de Bord Personnalisé par Rôle'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {userRole === 'COMMISSAIRE' && (isAR ? 'فضاء مراقب الحكام: متابعة التقارير المسجلة وإكمال التوقيعات' : 'Espace Commissaire / Inspecteur: Suivi de vos rapports et signatures')}
            {userRole === 'DNA' && (isAR ? 'فضاء الإدارة الوطنية للتحكيم: الإحصائيات العامة وتصنيف الحكام' : 'Espace DNA / Admin: Statistiques nationales, classement et validation')}
            {userRole === 'ADMIN' && (isAR ? 'فضاء المسؤول: الإدارات والتصنيفات والإحصائيات' : 'Espace Administration Centrale DNA')}
            {userRole === 'LECTURE' && (isAR ? 'فضاء الحكم: متابعة أعدادك ومستواك الفني وتوصيات المتفقدين' : 'Espace Arbitre: Consultation de vos notes, évolution et axes d amélioration')}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs">
          <button
            onClick={() => onRoleChange('COMMISSAIRE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              userRole === 'COMMISSAIRE'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Commissaire</span>
          </button>

          <button
            onClick={() => onRoleChange('DNA')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              userRole === 'DNA' || userRole === 'ADMIN'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DNA / Admin</span>
          </button>

          <button
            onClick={() => onRoleChange('LECTURE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              userRole === 'LECTURE'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Arbitre (Espace)</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. VUE DNA / ADMIN (National Statistics & Ranking)                  */}
      {/* ==================================================================== */}
      {(userRole === 'DNA' || userRole === 'ADMIN') && (
        <div className="space-y-8">
          
          {/* Quick Management Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Outils de Gestion Administration Centralisée DNA</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOfficialsTable}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Users className="w-4 h-4" />
                <span>Tableau des Officiels</span>
              </button>

              <button
                onClick={onOpenCriteriaSettings}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-700 text-amber-300"
              >
                <Target className="w-4 h-4" />
                <span>Paramétrage des Critères</span>
              </button>
            </div>
          </div>

          {/* Key Metric Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  Rapports Reçus DNA
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                  {totalReports}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  Moyenne Nationale Arbitrage
                </span>
                <span className="text-2xl font-black text-amber-500 font-mono mt-1 block">
                  {avgScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  Cartons Sanctionnés
                </span>
                <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
                  {totalCards}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  Taux de Validation Officielle
                </span>
                <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                  {totalReports > 0 ? Math.round((validatedCount / totalReports) * 100) : 0}%
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Distribution des Notes de Prestation (Ligue I)</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreBrackets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* League Breakdown */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-500" />
                <span>Performance Moyenne par Ligue Régionale</span>
              </h3>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Ligue Régionale de Tunis</span>
                  <span className="font-mono text-emerald-600 font-black">8.38 / 10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[83%]" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Ligue du Centre (Sousse)</span>
                  <span className="font-mono text-emerald-600 font-black">8.30 / 10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[83%]" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Ligue du Sud (Sfax)</span>
                  <span className="font-mono text-amber-500 font-black">8.15 / 10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[81%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. VUE COMMISSAIRE / INSPECTEUR (My Inspections & Drafts)            */}
      {/* ==================================================================== */}
      {userRole === 'COMMISSAIRE' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600/30 border border-red-500/40 text-red-300">
                Espace Commissaire de Match
              </span>
              <h2 className="text-xl font-black mt-2">
                Bienvenue, Mohamed Ali Ben Hassine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Inspecteur Fédéral — Ligue Régionale de Tunis
              </p>
            </div>

            <button
              onClick={onOpenOfficialsTable}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <Users className="w-4 h-4" />
              <span>Consulter l Annuaire des Officiels</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 block font-semibold">Mes Rapports Rédigés</span>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1 block">
                {reports.filter((r) => r.commissaireEmail === 'assesseurstunisie@gmail.com').length || reports.length}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 block font-semibold">En Attente de Signature</span>
              <span className="text-2xl font-black font-mono text-amber-500 mt-1 block">
                {reports.filter((r) => r.status === 'DRAFT').length}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 block font-semibold">Rapports Validés & Archivés</span>
              <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                {reports.filter((r) => r.status === 'VALIDATED').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VUE ARBITRE (Espace Arbitre - Progression & Personal Notes)       */}
      {/* ==================================================================== */}
      {userRole === 'LECTURE' && (
        <div className="space-y-8">
          
          {/* Header Card for Arbitre */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-2xl">
                NH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Arbitre International (FIFA)
                  </span>
                  <span className="text-xs text-slate-400">Ligue de Tunis</span>
                </div>
                <h2 className="text-xl font-black text-slate-100 mt-1">
                  Naim Hosni — Mon Espace de Prestations
                </h2>
                <p className="text-xs text-slate-400">
                  Consultez l'historique de vos évaluations, vos graphiques d'évolution et vos axes de progression transmis par les inspecteurs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ma Note Moyenne Saison</span>
              <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">8.37 <span className="text-xs text-slate-400 font-normal">/ 10</span></span>
            </div>
          </div>

          {/* Line Chart: Evolution over matchdays */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Évolution de ma Note au Fil des Journées (Saison 2025-2026)</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={refereeEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="matchDay" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[7.5, 9.0]} stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Points Forts & Axes d'Amélioration Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Points Forts */}
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Points Forts Identifiés par les Inspecteurs</span>
              </h4>
              <ul className="space-y-2 text-xs text-emerald-800 dark:text-emerald-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Confiance remarquable et calme absolu lors des duels tendus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Excellente lecture du jeu et anticipation des trajectoires de balle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Application judicieuse et constante de la règle de l avantage.</span>
                </li>
              </ul>
            </div>

            {/* Axes d'Amélioration */}
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Axes de Progression Recommandés</span>
              </h4>
              <ul className="space-y-2 text-xs text-amber-800 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold shrink-0">•</span>
                  <span>Rigueur accrue dans le contrôle du placement à 9.15m sur coup franc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold shrink-0">•</span>
                  <span>Gestion plus stricte du temps additionnel lors de la seconde période.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* TABLE DES RAPPORTS GENERALE                                          */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isAR ? 'قائمة التقارير المسجلة' : 'Séquence des Rapports d Inspection'}
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAR ? 'بحث بالكود، الفريق، المراقب...' : 'Recherche par code, équipe, commissaire...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            >
              <option value="ALL">{isAR ? 'جميع الحالات' : 'Tous les statuts'}</option>
              <option value="DRAFT">{isAR ? 'مسودة' : 'Brouillon'}</option>
              <option value="VALIDATED">{isAR ? 'مصادق عليه' : 'Validé'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">{isAR ? 'المباراة والمسابقة' : 'Match & Compétition'}</th>
                <th className="p-3">{isAR ? 'التاريخ' : 'Date'}</th>
                <th className="p-3 text-center">{isAR ? 'عدد الحكم' : 'Note Arbitre'}</th>
                <th className="p-3">{isAR ? 'المراقب' : 'Commissaire'}</th>
                <th className="p-3 text-center">{isAR ? 'الحالة' : 'Statut'}</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                    {isAR ? 'لم يتم العثور على أي تقارير مطابقة' : 'Aucun rapport ne correspond aux critères.'}
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {r.code}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {r.teamA} ({r.scoreFinalA}) - ({r.scoreFinalB}) {r.teamB}
                      </div>
                      <span className="text-[10px] text-slate-400">{r.competition} ({r.matchDay})</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">
                      {r.matchDate}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                        {r.calculatedRefereeScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {r.commissaireName || '---'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'VALIDATED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {r.status === 'VALIDATED' ? (isAR ? 'مصادق عليه' : 'Validé') : (isAR ? 'مسودة' : 'Brouillon')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectReport(r)}
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                          title={isAR ? 'تعديل التقرير' : 'Éditer'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportReportToPdf(r, lang)}
                          className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          title={isAR ? 'تحميل PDF' : 'Télécharger PDF'}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(r.id)}
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title={isAR ? 'حذف' : 'Supprimer'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
