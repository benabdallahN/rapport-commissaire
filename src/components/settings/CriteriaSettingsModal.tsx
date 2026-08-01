import React, { useState } from 'react';
import { CriterionItem, Language } from '../../types';
import { EVALUATION_CRITERIA } from '../../data/mockData';
import {
  Sliders,
  X,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface CriteriaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CriteriaSettingsModal: React.FC<CriteriaSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [criteria, setCriteria] = useState<CriterionItem[]>(EVALUATION_CRITERIA);
  const [activeCategory, setActiveCategory] = useState<
    'PERSONALITY' | 'PHYSICAL' | 'LAWS' | 'ASSISTANTS' | 'FOURTH'
  >('PERSONALITY');

  const [newTextFR, setNewTextFR] = useState('');
  const [newTextAR, setNewTextAR] = useState('');

  if (!isOpen) return null;

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTextFR || !newTextAR) return;

    const newItem: CriterionItem = {
      id: `crit_${Date.now()}`,
      categoryId: activeCategory,
      textFR: newTextFR,
      textAR: newTextAR,
    };

    setCriteria((prev) => [newItem, ...prev]);
    setNewTextFR('');
    setNewTextAR('');
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const currentCategoryCriteria = criteria.filter((c) => c.categoryId === activeCategory);

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'PERSONALITY':
        return isAR ? 'الشخصية والسلطة والسيطرة' : 'Personnalité & Autorité';
      case 'PHYSICAL':
        return isAR ? 'التقييم البدني والتمركز' : 'Condition Physique & Placement';
      case 'LAWS':
        return isAR ? 'تطبيق قوانين اللعبة' : 'Application des Lois du Jeu';
      case 'ASSISTANTS':
        return isAR ? 'تحكيم الحكام المساعدين' : 'Arbitrage des Assistants';
      default:
        return isAR ? 'الحكم الرابع' : '4ème Arbitre';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                Paramétrage DNA
              </span>
              <h2 className="text-lg font-black">
                {isAR ? 'إعداد المعايير الخاصة ونقاط التحسين' : 'Paramétrage des Critères & Axes d Amélioration'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center gap-2">
          {(['PERSONALITY', 'PHYSICAL', 'LAWS', 'ASSISTANTS', 'FOURTH'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {getCategoryTitle(cat)}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Add New Criterion Form */}
          <form onSubmit={handleAddCriterion} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Ajouter un nouveau critère spécifique dans cette catégorie</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Intitulé en Français</label>
                <input
                  type="text"
                  required
                  value={newTextFR}
                  onChange={(e) => setNewTextFR(e.target.value)}
                  placeholder="Ex: Gestion de la zone technique lors des moments sous pression"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">النص باللغة العربية</label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={newTextAR}
                  onChange={(e) => setNewTextAR(e.target.value)}
                  placeholder="مثال: التصرف السليم عند التوتر قرب المنطقة الفنية"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter aux Critères</span>
              </button>
            </div>
          </form>

          {/* List of Current Criteria */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Critères configurés ({currentCategoryCriteria.length})
            </h4>

            <div className="space-y-2">
              {currentCategoryCriteria.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{c.textFR}</p>
                    <p className="text-slate-500 font-arabic" dir="rtl">{c.textAR}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteCriterion(c.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
