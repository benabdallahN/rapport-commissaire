import React from 'react';
import { FTFLogo } from './FTFLogo';
import {
  Language,
  UserRole,
  ReportStatus
} from '../types';
import { AuthUser } from '../lib/supabase';
import {
  Globe,
  User,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  FolderOpen,
  BarChart3,
  Database,
  Award,
  HardDrive,
  Users,
  Sliders,
  LogIn,
  KeyRound
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageToggle: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: 'EDITOR' | 'DASHBOARD';
  onViewChange: (view: 'EDITOR' | 'DASHBOARD') => void;
  onNewReport: () => void;
  onOpenLibrary: () => void;
  onOpenSqlDrawer: () => void;
  onOpenAuthModal: () => void;
  onOpenDriveModal: () => void;
  onOpenOfficialsTable: () => void;
  onOpenCriteriaSettings: () => void;
  onOpenParametrageCentral?: () => void;
  onOpenAdminModal?: () => void;
  currentUser: AuthUser | null;
  autoSaveStatus: 'SAVED' | 'SAVING' | 'IDLE';
  currentReportCode?: string;
  currentReportStatus?: ReportStatus;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageToggle,
  userRole,
  onRoleChange,
  activeView,
  onViewChange,
  onNewReport,
  onOpenLibrary,
  onOpenSqlDrawer,
  onOpenAuthModal,
  onOpenDriveModal,
  onOpenOfficialsTable,
  onOpenCriteriaSettings,
  onOpenParametrageCentral,
  onOpenAdminModal,
  currentUser,
  autoSaveStatus,
  currentReportCode,
  currentReportStatus,
}) => {
  const isAR = lang === 'AR';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-white/10 backdrop-blur border border-white/20 shadow-md shadow-red-950/40 flex items-center justify-center">
              <FTFLogo size={46} className="drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/50 uppercase tracking-wide">
                  FTF / DNA
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentReportCode ? `[${currentReportCode}]` : 'v2.5 Full Stack'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                {isAR
                  ? 'تقرير متفقد الحكام - الإدارة الوطنية للتحكيم'
                  : 'Rapport Commissaire des Arbitres'}
              </h1>
            </div>
          </div>

          {/* Quick Actions & Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Auto save indicator */}
            {activeView === 'EDITOR' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-slate-800/80 border border-slate-700 text-slate-300">
                <CheckCircle2 className={`w-3.5 h-3.5 ${autoSaveStatus === 'SAVING' ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
                <span>
                  {autoSaveStatus === 'SAVING'
                    ? (isAR ? 'جاري الحفظ...' : 'Sauvegarde...')
                    : (isAR ? 'تم الحفظ' : 'Sauvegardé')}
                </span>
                {currentReportStatus && (
                  <span className={`ms-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                    currentReportStatus === 'VALIDATED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {currentReportStatus === 'VALIDATED' ? (isAR ? 'مصادق عليه' : 'Validé') : (isAR ? 'مسودة' : 'Brouillon')}
                  </span>
                )}
              </div>
            )}

            {/* View Switcher: Editor vs Dashboard */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
              <button
                onClick={() => onViewChange('EDITOR')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeView === 'EDITOR'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {isAR ? 'محرر التقرير' : 'Rapport'}
              </button>
              <button
                onClick={() => onViewChange('DASHBOARD')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'DASHBOARD'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {isAR ? 'لوحة التحكم' : 'Tableau de bord'}
              </button>
            </div>

            {/* Google Drive Button */}
            <button
              onClick={onOpenDriveModal}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Google Drive Storage (assesseurstunisie@gmail.com)"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Google Drive</span>
            </button>

            {/* Officials Directory Button */}
            <button
              onClick={onOpenOfficialsTable}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Tableau des Officiels"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Officiels</span>
            </button>

            {/* Centralized Paramétrage Button */}
            {onOpenParametrageCentral && (
              <button
                onClick={onOpenParametrageCentral}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Centre de Paramétrage Centralisé"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">{isAR ? 'الإعدادات' : 'Paramétrage'}</span>
              </button>
            )}

            {/* Admin Management Button */}
            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Espace Administrateur FTF / DNA"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </button>
            )}

            {/* Library button */}
            <button
              onClick={onOpenLibrary}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAR ? 'المكتبة' : 'Bibliothèque'}</span>
            </button>

            {/* New report button */}
            <button
              onClick={onNewReport}
              className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isAR ? 'جديد' : 'Nouveau'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onLanguageToggle}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'FR' ? 'العربية' : 'FR'}</span>
            </button>

            {/* Supabase SQL Drawer */}
            <button
              onClick={onOpenSqlDrawer}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Schéma SQL Supabase"
            >
              <Database className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Supabase Auth Login Button / User Indicator */}
            <button
              onClick={onOpenAuthModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                currentUser
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-red-600 hover:bg-red-500 border-red-500 text-white shadow'
              }`}
            >
              {currentUser ? (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion Supabase</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
