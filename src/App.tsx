import React, { useState, useEffect } from 'react';
import {
  FullReport,
  Language,
  UserRole
} from './types';
import { INITIAL_MOCK_REPORTS } from './data/mockData';
import { calculateWeightedRefereeScore, getPerformanceLabel } from './utils/calculations';
import { AuthUser, DEMO_USERS } from './lib/supabase';
import { Header } from './components/Header';
import { CarnetTabs, TabType } from './components/CarnetTabs';
import { GeneralInfoSection } from './components/sections/GeneralInfoSection';
import { OfficialsSection } from './components/sections/OfficialsSection';
import { RefereeEvalSection } from './components/sections/RefereeEvalSection';
import { AssistantsEvalSection } from './components/sections/AssistantsEvalSection';
import { RecapSection } from './components/sections/RecapSection';
import { MatchEventsSection } from './components/sections/MatchEventsSection';
import { ValidationSection } from './components/sections/ValidationSection';
import { DashboardView } from './components/DashboardView';
import { LibraryModal } from './components/LibraryModal';
import { SqlDrawer } from './components/SqlDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { SupabaseConfigModal } from './components/auth/SupabaseConfigModal';
import { GoogleDriveModal } from './components/drive/GoogleDriveModal';
import { OfficialsTableModal, OfficialItem } from './components/officials/OfficialsTableModal';
import { CriteriaSettingsModal } from './components/settings/CriteriaSettingsModal';
import { DnaAxesSettingsModal } from './components/settings/DnaAxesSettingsModal';
import { AdminManagementModal } from './components/admin/AdminManagementModal';
import { ParametrageCentralModal } from './components/settings/ParametrageCentralModal';

export default function App() {
  const [lang, setLang] = useState<Language>('FR');
  const [userRole, setUserRole] = useState<UserRole>('COMMISSAIRE');
  const [activeView, setActiveView] = useState<'EDITOR' | 'DASHBOARD'>('EDITOR');
  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');

  // Supabase User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    DEMO_USERS['assesseurstunisie@gmail.com']
  );

  // Modals visibility state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSqlDrawerOpen, setIsSqlDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isOfficialsTableOpen, setIsOfficialsTableOpen] = useState(false);
  const [isCriteriaSettingsOpen, setIsCriteriaSettingsOpen] = useState(false);
  const [isDnaAxesModalOpen, setIsDnaAxesModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isParametrageModalOpen, setIsParametrageModalOpen] = useState(false);

  // Auto-save status
  const [autoSaveStatus, setAutoSaveStatus] = useState<'SAVED' | 'SAVING' | 'IDLE'>('SAVED');

  // Load persistent reports from LocalStorage or mock data
  const [reports, setReports] = useState<FullReport[]>(() => {
    try {
      const saved = localStorage.getItem('dna_commissioner_reports_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load reports from LocalStorage:', e);
    }
    return INITIAL_MOCK_REPORTS;
  });

  const [activeReportId, setActiveReportId] = useState<string>(
    reports[0]?.id || 'rep_1'
  );

  // Save reports to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dna_commissioner_reports_v2', JSON.stringify(reports));
      setAutoSaveStatus('SAVED');
    } catch (e) {
      console.error('Failed to save to LocalStorage:', e);
    }
  }, [reports]);

  // Current Report object
  const currentReport = reports.find((r) => r.id === activeReportId) || reports[0];

  // Helper to update current active report
  const handleUpdateCurrentReport = (updatedFields: Partial<FullReport>) => {
    setAutoSaveStatus('SAVING');

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === activeReportId) {
          const updated = { ...r, ...updatedFields, updatedAt: new Date().toISOString() };

          // Recalculate referee score if evaluations updated
          if (updatedFields.evaluations) {
            const newScore = calculateWeightedRefereeScore(
              updated.evaluations.personality.score,
              updated.evaluations.physical.score,
              updated.evaluations.laws.score
            );
            const perf = getPerformanceLabel(newScore, lang);
            updated.calculatedRefereeScore = newScore;
            updated.calculatedPerformanceFR = perf.textFR;
            updated.calculatedPerformanceAR = perf.textAR;
          }

          return updated;
        }
        return r;
      })
    );
  };

  // Create fresh report
  const handleNewReport = () => {
    const newCode = `RAP-2026-00${reports.length + 1}`;
    const newRep: FullReport = {
      id: `rep_${Date.now()}`,
      code: newCode,
      season: '2025-2026',
      competition: 'Ligue I (Professionnelle)',
      matchDay: 'J15',
      matchDate: new Date().toISOString().split('T')[0],
      matchTime: '15:00',
      city: 'Tunis',
      stadium: 'Stade Hammadi Agrebi de Radès',
      teamA: 'Espérance Sportive de Tunis',
      teamB: 'Club Africain',
      teamAAbbr: 'EST',
      teamBAbbr: 'CA',
      scoreHalfA: 0,
      scoreHalfB: 0,
      scoreFinalA: 0,
      scoreFinalB: 0,
      difficultyLevel: 'MOYENNE',
      officials: [
        { id: 'o1', role: 'REFEREE', name: '', league: 'Tunis', grade: 'Fédéral' },
        { id: 'o2', role: 'ASSISTANT_1', name: '', league: 'Tunis', grade: 'Fédéral' },
        { id: 'o3', role: 'ASSISTANT_2', name: '', league: 'Tunis', grade: '1ère Série' },
        { id: 'o4', role: 'FOURTH', name: '', league: 'Nabeul', grade: '2ème Série' },
        { id: 'o5', role: 'VAR', name: '', league: 'Tunis', grade: 'Fédéral' },
        { id: 'o6', role: 'AVAR', name: '', league: 'Sousse', grade: 'Fédéral' },
        { id: 'o7', role: 'INSPECTOR', name: currentUser?.email || 'assesseurstunisie@gmail.com', league: 'Tunis', grade: 'Fédéral' },
      ],
      evaluations: {
        personality: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
        physical: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
        laws: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
        assistant1: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
        assistant2: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
        fourthOfficial: { score: 8.2, positiveAspects: [], improvementPoints: [], comments: '' },
      },
      calculatedRefereeScore: 8.2,
      calculatedPerformanceFR: 'Satisfaisant',
      calculatedPerformanceAR: 'مرضٍ (Satisfaisant)',
      substitutions: [],
      cards: [],
      staffIncidents: [],
      crowdIncidents: [],
      generalComments: '',
      commissaireName: currentUser?.name || 'Mohamed Ali Ben Hassine',
      commissaireEmail: currentUser?.email || 'assesseurstunisie@gmail.com',
      citySignature: 'Tunis',
      dateSignature: new Date().toISOString().split('T')[0],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReports((prev) => [newRep, ...prev]);
    setActiveReportId(newRep.id);
    setActiveView('EDITOR');
    setActiveTab('GENERAL');
  };

  const handleDeleteReport = (id: string) => {
    if (reports.length <= 1) return;
    const remaining = reports.filter((r) => r.id !== id);
    setReports(remaining);
    if (activeReportId === id) {
      setActiveReportId(remaining[0].id);
    }
  };

  const handleDuplicateReport = (rep: FullReport) => {
    const dup: FullReport = {
      ...rep,
      id: `rep_${Date.now()}`,
      code: `${rep.code}-COP`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReports((prev) => [dup, ...prev]);
    setActiveReportId(dup.id);
  };

  // Picking official from Directory into current report
  const handleSelectOfficialForReport = (official: OfficialItem) => {
    if (!currentReport) return;
    const updatedOfficials = currentReport.officials.map((off) => {
      if (off.role === official.role) {
        return {
          ...off,
          name: official.name,
          league: official.league,
          grade: official.grade,
        };
      }
      return off;
    });

    handleUpdateCurrentReport({ officials: updatedOfficials });
    setActiveView('EDITOR');
    setActiveTab('OFFICIALS');
  };

  const isAR = lang === 'AR';

  return (
    <div
      dir={isAR ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors"
    >
      {/* Header */}
      <Header
        lang={lang}
        onLanguageToggle={() => setLang((prev) => (prev === 'FR' ? 'AR' : 'FR'))}
        userRole={userRole}
        onRoleChange={setUserRole}
        activeView={activeView}
        onViewChange={setActiveView}
        onNewReport={handleNewReport}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenSqlDrawer={() => setIsSqlDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenOfficialsTable={() => setIsOfficialsTableOpen(true)}
        onOpenCriteriaSettings={() => setIsCriteriaSettingsOpen(true)}
        onOpenParametrageCentral={() => setIsParametrageModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        currentUser={currentUser}
        autoSaveStatus={autoSaveStatus}
        currentReportCode={currentReport?.code}
        currentReportStatus={currentReport?.status}
      />

      {/* Main Content Area */}
      {activeView === 'EDITOR' ? (
        <main className="flex-1 pb-16">
          {/* Carnet Tab Navigation */}
          <CarnetTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lang={lang}
          />

          {/* Section Render */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {currentReport && (
              <>
                {activeTab === 'GENERAL' && (
                  <GeneralInfoSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'OFFICIALS' && (
                  <OfficialsSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'REFEREE_EVAL' && (
                  <RefereeEvalSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'ASSISTANTS_EVAL' && (
                  <AssistantsEvalSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'RECAP' && (
                  <RecapSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'MATCH_EVENTS' && (
                  <MatchEventsSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}

                {activeTab === 'VALIDATION' && (
                  <ValidationSection
                    report={currentReport}
                    onChange={handleUpdateCurrentReport}
                    lang={lang}
                  />
                )}
              </>
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 pb-16">
          <DashboardView
            reports={reports}
            onSelectReport={(rep) => {
              setActiveReportId(rep.id);
              setActiveView('EDITOR');
            }}
            onDeleteReport={handleDeleteReport}
            lang={lang}
            userRole={userRole}
            onRoleChange={setUserRole}
            onOpenOfficialsTable={() => setIsOfficialsTableOpen(true)}
            onOpenCriteriaSettings={() => setIsCriteriaSettingsOpen(true)}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p>
            <b>Fédération Tunisienne de Football (FTF)</b> — Direction Nationale de l'Arbitrage (DNA)
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Système d'évaluation et de contrôle des prestations d'arbitrage — Application Web Bilingue (Français / العربية)
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        reports={reports}
        onSelectReport={(rep) => setActiveReportId(rep.id)}
        onDeleteReport={handleDeleteReport}
        onDuplicateReport={handleDuplicateReport}
        lang={lang}
      />

      <SqlDrawer
        isOpen={isSqlDrawerOpen}
        onClose={() => setIsSqlDrawerOpen(false)}
        lang={lang}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(usr) => {
          setCurrentUser(usr);
          setUserRole(usr.role);
        }}
        onLogout={() => setCurrentUser(null)}
        lang={lang}
        onOpenConfig={() => setIsSupabaseConfigOpen(true)}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        currentReport={currentReport}
        lang={lang}
      />

      <OfficialsTableModal
        isOpen={isOfficialsTableOpen}
        onClose={() => setIsOfficialsTableOpen(false)}
        lang={lang}
        onSelectOfficialForReport={handleSelectOfficialForReport}
      />

      <CriteriaSettingsModal
        isOpen={isCriteriaSettingsOpen}
        onClose={() => setIsCriteriaSettingsOpen(false)}
        lang={lang}
      />

      <DnaAxesSettingsModal
        isOpen={isDnaAxesModalOpen}
        onClose={() => setIsDnaAxesModalOpen(false)}
        lang={lang}
      />

      <AdminManagementModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
      />

      <ParametrageCentralModal
        isOpen={isParametrageModalOpen || activeTab === 'PARAMETRAGE'}
        onClose={() => {
          setIsParametrageModalOpen(false);
          if (activeTab === 'PARAMETRAGE') setActiveTab('GENERAL');
        }}
        lang={lang}
      />

    </div>
  );
}
