import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import {
  DnaEvaluationAxis,
  getStoredDnaAxes,
  saveStoredDnaAxes,
  resetToDefaultDnaAxes,
  calculateDynamicRefereeScore,
} from '../../data/dnaAxesData';
import {
  Sliders,
  X,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Calculator,
  Eye,
  Info,
} from 'lucide-react';

interface DnaAxesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAxesUpdated?: () => void;
}

export const DnaAxesSettingsModal: React.FC<DnaAxesSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAxesUpdated,
}) => {
  const isAR = lang === 'AR';

  const [axes, setAxes] = useState<DnaEvaluationAxis[]>([]);
  const [editingAxis, setEditingAxis] = useState<Partial<DnaEvaluationAxis> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Live simulator state
  const [testScores, setTestScores] = useState<Record<string, number>>({
    personality: 8.4,
    physical: 8.2,
    laws: 8.6,
  });

  useEffect(() => {
    if (isOpen) {
      const loaded = getStoredDnaAxes();
      setAxes(loaded);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAxes = (updatedAxes: DnaEvaluationAxis[]) => {
    setAxes(updatedAxes);
    saveStoredDnaAxes(updatedAxes);
    if (onAxesUpdated) onAxesUpdated();
  };

  const handleToggleActive = (axisId: string) => {
    const updated = axes.map((a) => {
      if (a.id === axisId) {
        return { ...a, isActive: !a.isActive };
      }
      return a;
    });
    handleSaveAxes(updated);
  };

  const handleMoveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= axes.length) return;

    const newAxes = [...axes];
    const temp = newAxes[index];
    newAxes[index] = newAxes[targetIndex];
    newAxes[targetIndex] = temp;

    // Re-assign display order
    const reordered = newAxes.map((a, idx) => ({ ...a, displayOrder: idx + 1 }));
    handleSaveAxes(reordered);
  };

  const handleDeleteAxis = (axisId: string) => {
    const target = axes.find((a) => a.id === axisId);
    if (!target) return;

    const confirmMsg = isAR
      ? `هل أنت تأكد من حذف المحور "${target.titleAR}"؟`
      : `Êtes-vous sûr de vouloir supprimer l'axe "${target.titleFR}" ?`;

    if (window.confirm(confirmMsg)) {
      const updated = axes.filter((a) => a.id !== axisId);
      handleSaveAxes(updated);
    }
  };

  const handleResetDefaults = () => {
    const confirmMsg = isAR
      ? 'إعادة تعيين المحاور والمعاملات إلى المعايير القياسية للإدارة الوطنية للتحكيم؟'
      : 'Réinitialiser tous les axes et coefficients aux barèmes standards DNA ?';

    if (window.confirm(confirmMsg)) {
      const defs = resetToDefaultDnaAxes();
      setAxes(defs);
      if (onAxesUpdated) onAxesUpdated();
    }
  };

  const handleOpenFormNew = () => {
    setEditingAxis({
      id: `axis_${Date.now()}`,
      code: `AXIS_${Date.now().toString().slice(-4)}`,
      titleFR: '',
      titleAR: '',
      descriptionFR: '',
      descriptionAR: '',
      coefficient: 1,
      isActive: true,
      displayOrder: axes.length + 1,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300',
    });
    setIsFormOpen(true);
  };

  const handleOpenFormEdit = (axis: DnaEvaluationAxis) => {
    setEditingAxis({ ...axis });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAxis || !editingAxis.titleFR || !editingAxis.titleAR) return;

    const exists = axes.some((a) => a.id === editingAxis.id);
    let updatedList: DnaEvaluationAxis[] = [];

    if (exists) {
      updatedList = axes.map((a) =>
        a.id === editingAxis.id ? (editingAxis as DnaEvaluationAxis) : a
      );
    } else {
      updatedList = [...axes, editingAxis as DnaEvaluationAxis];
    }

    handleSaveAxes(updatedList);
    setIsFormOpen(false);
    setEditingAxis(null);
  };

  // Live simulation calculation
  const simResult = calculateDynamicRefereeScore(
    Object.fromEntries(
      Object.entries(testScores).map(([k, v]) => [k, { score: v }])
    ),
    axes,
    lang
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                Direction Nationale de l'Arbitrage (DNA)
              </span>
              <h2 className="text-lg font-black">
                {isAR
                  ? 'إدارة محاور التقييم ومعاملات الترجيح والمعادلة'
                  : 'Paramétrage des Axes d\'Évaluation & Barèmes de Notation'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Information & Traceability Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold">
                {isAR
                  ? 'إستقلالية التكوين وضمان الشفافية التاريخية :'
                  : 'Autonomie totale de la DNA & Traçabilité des rapports :'}
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {isAR
                  ? 'تتيح هذه الشاشة إضافة، تعديل، تفعيل أو إلغاء تفعيل أي محور تقييم للتمشي مع قرارات الإدارة الوطنية. يتم إعادة حساب المعادلة تلقائياً بدون أي تعديل برمجي. التقارير المصادق عليها سابقاً تحتفظ بمعادلتها وقيمها الأصلية.'
                  : 'Ce module vous permet de créer, réordonner, activer ou ajuster les coefficients des axes d\'évaluation. La formule est recalculée automatiquement en temps réel pour tous les nouveaux rapports.'}
              </p>
            </div>
          </div>

          {/* Real-time Formula Preview & Live Simulator */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-amber-300">
                  {isAR ? 'معاينة المعادلة التلقائية المستعملة' : 'Formule Dynamique Auto-Générée (DNA)'}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {simResult.activeAxes.length} {isAR ? 'محاور مفعلة' : 'axe(s) actif(s)'} | {isAR ? 'مجموع المعاملات' : 'Somme coef'}: {simResult.sumCoeffs}
              </span>
            </div>

            {/* Formula Expression */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-amber-200 leading-relaxed overflow-x-auto">
              {isAR ? simResult.formulaStrAR : simResult.formulaStrFR}
            </div>

            {/* Live Interactive Simulator */}
            <div className="pt-2 space-y-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAR ? 'محاكاة مباشرة لاحتساب العدد النهائي :' : 'Simulateur de calcul dynamique en direct :'}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {simResult.activeAxes.map((axis) => (
                  <div key={axis.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200 truncate">{isAR ? axis.titleAR : axis.titleFR}</span>
                      <span className="font-mono font-bold text-amber-400">×{axis.coefficient}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="6.0"
                        max="10.0"
                        step="0.1"
                        value={testScores[axis.id] ?? 8.0}
                        onChange={(e) =>
                          setTestScores({ ...testScores, [axis.id]: parseFloat(e.target.value) })
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-xs text-white w-8 text-right">
                        {(testScores[axis.id] ?? 8.0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Computed Simulation Output */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs mt-3">
                <span className="text-amber-200 font-medium">
                  {isAR ? 'النتيجة المحسوبة بالتطبيق :' : 'Résultat de la simulation :'} <span className="font-mono">{simResult.breakdownStr}</span>
                </span>
                <span className="text-sm font-black text-amber-400 font-mono px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40">
                  {simResult.score.toFixed(2)} / 10 ({simResult.performanceFR})
                </span>
              </div>
            </div>
          </div>

          {/* Action Header for Axes List */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {isAR ? 'قائمة محاور التقييم المعرفة' : 'Liste des Axes d\'Évaluation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAR
                  ? 'يمكنك تغيير الترتيب، التفعيل، الحذف والتعديل'
                  : 'Gérez l\'ordre d\'affichage, l\'activation et les coefficients'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Restaurer la configuration par défaut de la DNA"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAR ? 'استعادة المعايير' : 'Réinitialiser'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenFormNew}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{isAR ? 'إضافة محور جديد' : 'Créer un axe'}</span>
              </button>
            </div>
          </div>

          {/* Table / List of Axes */}
          <div className="space-y-3">
            {axes.map((axis, index) => (
              <div
                key={axis.id}
                className={`p-4 rounded-2xl border transition-all ${
                  axis.isActive
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mt-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveOrder(index, 'UP')}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        #{axis.displayOrder}
                      </span>
                      <button
                        type="button"
                        disabled={index === axes.length - 1}
                        onClick={() => handleMoveOrder(index, 'DOWN')}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {isAR ? axis.titleAR : axis.titleFR}
                        </h4>
                        <span className="text-xs text-slate-400 font-normal">
                          ({isAR ? axis.titleFR : axis.titleAR})
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          Coef: ×{axis.coefficient}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            axis.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {axis.isActive ? (isAR ? 'مفعل' : 'Actif') : (isAR ? 'معطل' : 'Inactif')}
                        </span>
                      </div>

                      {axis.descriptionFR && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isAR ? axis.descriptionAR || axis.descriptionFR : axis.descriptionFR}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Toggle Active Switch */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {axis.isActive ? (isAR ? 'مفعل' : 'Actif') : (isAR ? 'غير مفعل' : 'Inactif')}
                      </span>
                      <input
                        type="checkbox"
                        checked={axis.isActive}
                        onChange={() => handleToggleActive(axis.id)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleOpenFormEdit(axis)}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title={isAR ? 'تعديل المحور' : 'Modifier cet axe'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAxis(axis.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title={isAR ? 'حذف المحور' : 'Supprimer cet axe'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Form Modal / Drawer inside for Create & Edit */}
          {isFormOpen && editingAxis && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-amber-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {editingAxis.id && axes.some((a) => a.id === editingAxis.id)
                      ? isAR
                        ? 'تعديل محور تقييم'
                        : 'Modifier l\'axe d\'évaluation'
                      : isAR
                      ? 'إنشاء محور تقييم جديد'
                      : 'Créer un nouvel axe d\'évaluation'}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Intitulé de l'axe (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAxis.titleFR || ''}
                      onChange={(e) => setEditingAxis({ ...editingAxis, titleFR: e.target.value })}
                      placeholder="Ex: Interprétation & Application des Lois du Jeu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      اسم المحور (باللغة العربية) *
                    </label>
                    <input
                      type="text"
                      required
                      dir="rtl"
                      value={editingAxis.titleAR || ''}
                      onChange={(e) => setEditingAxis({ ...editingAxis, titleAR: e.target.value })}
                      placeholder="مثال: تطبيق وتفسير قوانين اللعبة"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Coefficient de pondération (المعامل) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={editingAxis.coefficient ?? 1}
                      onChange={(e) =>
                        setEditingAxis({ ...editingAxis, coefficient: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Ordre d'affichage (ترتيب العرض)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingAxis.displayOrder ?? 1}
                      onChange={(e) =>
                        setEditingAxis({ ...editingAxis, displayOrder: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Description & Directives d'évaluation (FR)
                    </label>
                    <input
                      type="text"
                      value={editingAxis.descriptionFR || ''}
                      onChange={(e) => setEditingAxis({ ...editingAxis, descriptionFR: e.target.value })}
                      placeholder="Description facultative pour guider le commissaire..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {isAR ? 'إلغاء' : 'Annuler'}
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                  >
                    {isAR ? 'حفظ المحور' : 'Enregistrer l\'Axe'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
