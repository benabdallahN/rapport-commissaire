import React from 'react';
import { Language } from '../types';
import {
  FileText,
  Users,
  UserCheck,
  Medal,
  Calculator,
  AlertTriangle,
  Send,
  Sliders
} from 'lucide-react';

export type TabType =
  | 'GENERAL'
  | 'OFFICIALS'
  | 'REFEREE_EVAL'
  | 'ASSISTANTS_EVAL'
  | 'RECAP'
  | 'MATCH_EVENTS'
  | 'VALIDATION'
  | 'PARAMETRAGE';

interface CarnetTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  lang: Language;
}

export const CarnetTabs: React.FC<CarnetTabsProps> = ({
  activeTab,
  onTabChange,
  lang,
}) => {
  const isAR = lang === 'AR';

  const tabs: { id: TabType; labelFR: string; labelAR: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'GENERAL',
      labelFR: '1. Infos Générales',
      labelAR: '1. معلومات عامة',
      icon: <FileText className="w-4 h-4" />,
      color: 'border-blue-500 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'OFFICIALS',
      labelFR: '2. Officiels',
      labelAR: '2. طاقم التحكيم',
      icon: <Users className="w-4 h-4" />,
      color: 'border-purple-500 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'REFEREE_EVAL',
      labelFR: '3. Évaluation Arbitre',
      labelAR: '3. تقييم الحكم',
      icon: <UserCheck className="w-4 h-4" />,
      color: 'border-red-500 text-red-600 dark:text-red-400'
    },
    {
      id: 'ASSISTANTS_EVAL',
      labelFR: '4. Assistants & 4ᵉ',
      labelAR: '4. المساعدون والحكم 4',
      icon: <Medal className="w-4 h-4" />,
      color: 'border-amber-500 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'RECAP',
      labelFR: '5. Récapitulatif',
      labelAR: '5. ملخص التقييم',
      icon: <Calculator className="w-4 h-4" />,
      color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'MATCH_EVENTS',
      labelFR: '6. Faits de Match',
      labelAR: '6. أحداث المباراة',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'border-orange-500 text-orange-600 dark:text-orange-400'
    },
    {
      id: 'VALIDATION',
      labelFR: '7. Validation & Export',
      labelAR: '7. المصادقة والتصدير',
      icon: <Send className="w-4 h-4" />,
      color: 'border-teal-500 text-teal-600 dark:text-teal-400'
    },
    {
      id: 'PARAMETRAGE',
      labelFR: '8. Paramétrage',
      labelAR: '8. الإعدادات والتهيئ',
      icon: <Sliders className="w-4 h-4" />,
      color: 'border-amber-500 text-amber-600 dark:text-amber-400'
    },
  ];

  return (
    <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? `bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 shadow-sm border-b-2 ${tab.color}`
                    : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{isAR ? tab.labelAR : tab.labelFR}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
