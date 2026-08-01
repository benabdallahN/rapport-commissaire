import React, { useMemo } from 'react';
import {
  CategoryEvaluation,
  EvaluationObservation,
  FullReport,
  Language,
} from '../../types';
import { EVALUATION_CRITERIA } from '../../data/mockData';
import { getStoredExamLevels } from '../../data/competitionsAndClubsData';
import {
  getStoredDnaAxes,
  calculateDynamicRefereeScore,
  DnaEvaluationAxis,
} from '../../data/dnaAxesData';
import {
  generateRatingScale,
  getPerformanceLabel,
} from '../../utils/calculations';
import {
  UserCheck,
  PlusCircle,
  AlertCircle,
  GraduationCap,
  Calculator,
} from 'lucide-react';

interface RefereeEvalSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const RefereeEvalSection: React.FC<RefereeEvalSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';
  const ratingScale = generateRatingScale();
  const examLevels = getStoredExamLevels();

  // Load active axes (use snapshot if present, else fallback to current stored DNA axes)
  const activeAxes = useMemo(() => {
    if (report.axesSnapshot && report.axesSnapshot.length > 0) {
      return report.axesSnapshot.filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const current = getStoredDnaAxes();
    return current.filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [report.axesSnapshot]);

  const refExam = report.practicalExams?.referee || { isExam: false, examLevel: 'Examen Fédéral' };

  const handleExamChange = (isExam: boolean, examLevel?: string) => {
    const currentExams = report.practicalExams || {};
    onChange({
      practicalExams: {
        ...currentExams,
        referee: {
          isExam,
          examLevel: examLevel ?? refExam.examLevel ?? 'Examen Fédéral',
        },
      },
    });
  };

  const handleAxisCategoryChange = (
    axisId: string,
    updatedCat: Partial<CategoryEvaluation>
  ) => {
    const currentAxisEval: CategoryEvaluation = report.evaluations[axisId] || {
      score: 8.0,
      positiveAspects: [],
      improvementPoints: [],
      comments: '',
    };

    const newCat: CategoryEvaluation = { ...currentAxisEval, ...updatedCat };

    const newEvals = {
      ...report.evaluations,
      [axisId]: newCat,
    };

    // Calculate score using active DNA axes
    const calcResult = calculateDynamicRefereeScore(newEvals, activeAxes, lang);

    onChange({
      evaluations: newEvals,
      calculatedRefereeScore: calcResult.score,
      calculatedPerformanceFR: calcResult.performanceFR,
      calculatedPerformanceAR: calcResult.performanceAR,
      axesSnapshot: activeAxes,
    });
  };

  const currentScore = report.calculatedRefereeScore;
  const calcResult = calculateDynamicRefereeScore(report.evaluations, activeAxes, lang);
  const perf = getPerformanceLabel(currentScore, lang);

  const refereeOfficial = report.officials.find((o) => o.role === 'REFEREE');
  const refDifficulty = refereeOfficial?.difficultyLevel || report.difficultyLevel || 'MOYENNE';

  const handleRefereeDifficultyChange = (diff: 'FACILE' | 'MOYENNE' | 'ELEVEE') => {
    const updatedOfficials = report.officials.map((o) =>
      o.role === 'REFEREE' ? { ...o, difficultyLevel: diff } : o
    );
    onChange({ officials: updatedOfficials });
  };

  return (
    <div className="space-y-6">
      {/* Practical Exam & Individual Difficulty Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              {isAR ? 'امتحان تطبيقي ودرجة الصعوبة للحكم الرئيسي' : 'Statut Examen & Degré de Difficulté — Arbitre Central'}
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
              {isAR
                ? 'تحديد درجة صعوبة المباراة الخاصة بالحكم الرئيسي وإمكانية كونه امتحاناً تطبيقياً'
                : 'Évaluation individuelle du degré de difficulté du match et épreuve pratique.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-amber-200 dark:border-slate-700 shadow-sm text-xs">
          {/* Difficulty Dropdown for Central Referee */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">{isAR ? 'الصعوبة:' : 'Difficulté :'}</span>
            <select
              value={refDifficulty}
              onChange={(e) => handleRefereeDifficultyChange(e.target.value as any)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 focus:outline-none"
            >
              <option value="FACILE">{isAR ? 'سهلة (Facile)' : 'Facile'}</option>
              <option value="MOYENNE">{isAR ? 'متوسطة (Moyenne)' : 'Moyenne'}</option>
              <option value="ELEVEE">{isAR ? 'عالية (Élevée)' : 'Élevée'}</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={refExam.isExam}
              onChange={(e) => handleExamChange(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span>{isAR ? 'امتحان تطبيقي' : 'Examen Pratique'}</span>
          </label>

          {refExam.isExam && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="font-semibold text-slate-500">{isAR ? 'المستوى:' : 'Niveau :'}</span>
              <select
                value={refExam.examLevel}
                onChange={(e) => handleExamChange(true, e.target.value)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 focus:outline-none"
              >
                {examLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.nameFR}>
                    {isAR ? lvl.nameAR : lvl.nameFR}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Live Dynamic Score Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-start">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
              {isAR ? 'معادلة DNA المعتمدة' : 'Formule Officielle DNA'}
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAR ? calcResult.formulaStrAR : calcResult.formulaStrFR}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isAR ? 'التقييم الشامل والعدد النهائي للحكم' : 'Évaluation globale de l\'Arbitre Central'}
          </h2>
          <div className="text-xs text-amber-200 font-mono bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 inline-block">
            {calcResult.breakdownStr}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-700/80 shadow-inner">
          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold">
              {isAR ? 'العدد النهائي' : 'Note Finale'}
            </span>
            <span className="text-3xl font-black text-amber-400 font-mono">
              {currentScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>

          <div className="h-10 w-px bg-slate-700" />

          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold">
              {isAR ? 'الدرجة والتقييم' : 'Performance'}
            </span>
            <span className={`inline-block px-3 py-1 mt-1 text-xs font-bold rounded-lg border ${perf.badgeColor}`}>
              {isAR ? perf.textAR : perf.textFR}
            </span>
          </div>
        </div>
      </div>

      {/* Active DNA Axes Loop */}
      {activeAxes.map((axis) => {
        const evalData: CategoryEvaluation = report.evaluations[axis.id] ||
          report.evaluations[axis.code.toLowerCase()] || {
            score: 8.0,
            positiveAspects: [],
            improvementPoints: [],
            comments: '',
          };

        // Criteria list for dropdowns
        const categoryCriteria = EVALUATION_CRITERIA.filter(
          (c) => c.categoryId === axis.code || c.categoryId === axis.id.toUpperCase()
        );
        const fallbackCriteria = categoryCriteria.length > 0 ? categoryCriteria : EVALUATION_CRITERIA;

        const handleObservationChange = (
          type: 'POSITIVE' | 'IMPROVEMENT',
          slotIndex: number,
          criterionId: string,
          minute?: number
        ) => {
          const crit = fallbackCriteria.find((c) => c.id === criterionId);
          const currentList =
            type === 'POSITIVE'
              ? [...evalData.positiveAspects]
              : [...evalData.improvementPoints];

          if (!criterionId) {
            currentList.splice(slotIndex, 1);
          } else {
            const newObs: EvaluationObservation = {
              id: currentList[slotIndex]?.id || `obs_${Date.now()}_${Math.random()}`,
              criterionId,
              textFR: crit?.textFR || '',
              textAR: crit?.textAR || '',
              minute: minute !== undefined ? minute : currentList[slotIndex]?.minute,
            };
            currentList[slotIndex] = newObs;
          }

          if (type === 'POSITIVE') {
            handleAxisCategoryChange(axis.id, { positiveAspects: currentList });
          } else {
            handleAxisCategoryChange(axis.id, { improvementPoints: currentList });
          }
        };

        return (
          <div
            key={axis.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
          >
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <UserCheck className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {isAR ? axis.titleAR : axis.titleFR}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md border bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-mono">
                      {isAR ? `المعامل ×${axis.coefficient}` : `Coefficient ×${axis.coefficient}`}
                    </span>
                    {axis.descriptionFR && (
                      <span className="text-xs text-slate-400 font-normal truncate max-w-md">
                        {isAR ? axis.descriptionAR || axis.descriptionFR : axis.descriptionFR}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Selector */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAR ? 'العدد /10:' : 'Note /10:'}
                </label>
                <select
                  value={evalData.score}
                  onChange={(e) =>
                    handleAxisCategoryChange(axis.id, {
                      score: parseFloat(e.target.value) || 8.0,
                    })
                  }
                  className="px-3 py-1 text-sm font-black rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 focus:outline-none font-mono"
                >
                  {ratingScale.map((val) => (
                    <option key={val} value={val}>
                      {val.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Positive Aspects */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAR ? 'الجوانب الإيجابية (إضافة ديناميكية)' : 'Aspects Positifs'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentList = [...evalData.positiveAspects];
                    currentList.push({
                      id: `obs_${Date.now()}_${Math.random()}`,
                      criterionId: '',
                      textFR: '',
                      textAR: '',
                    });
                    handleAxisCategoryChange(axis.id, { positiveAspects: currentList });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAR ? 'إضافة معيار' : 'Ajouter un critère'}</span>
                </button>
              </div>

              {evalData.positiveAspects.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/30">
                  {isAR ? 'لم يتم إضافة أي جوانب إيجابية بعد' : 'Aucun aspect positif ajouté pour le moment.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evalData.positiveAspects.map((currentObs, slotIdx) => (
                    <div
                      key={currentObs.id || slotIdx}
                      className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        <span>{isAR ? `معيار إيجابي #${slotIdx + 1}` : `Critère Positif #${slotIdx + 1}`}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">{isAR ? 'دقيقة' : 'Min'}</span>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={currentObs?.minute || ''}
                              onChange={(e) =>
                                handleObservationChange(
                                  'POSITIVE',
                                  slotIdx,
                                  currentObs?.criterionId || '',
                                  parseInt(e.target.value) || undefined
                                )
                              }
                              className="w-12 px-1.5 py-0.5 text-center text-xs font-mono font-bold rounded border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                              placeholder="Min"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...evalData.positiveAspects];
                              currentList.splice(slotIdx, 1);
                              handleAxisCategoryChange(axis.id, { positiveAspects: currentList });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950"
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <select
                        value={currentObs?.criterionId || ''}
                        onChange={(e) =>
                          handleObservationChange(
                            'POSITIVE',
                            slotIdx,
                            e.target.value,
                            currentObs?.minute
                          )
                        }
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      >
                        <option value="">{isAR ? '-- اختر معياراً إيجابياً --' : '-- Choisir un aspect positif --'}</option>
                        {fallbackCriteria.map((crit) => (
                          <option key={crit.id} value={crit.id}>
                            {isAR ? crit.textAR : crit.textFR}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Improvement Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isAR ? 'نقاط التطوير / النقائص' : 'Points à Améliorer'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentList = [...evalData.improvementPoints];
                    currentList.push({
                      id: `obs_${Date.now()}_${Math.random()}`,
                      criterionId: '',
                      textFR: '',
                      textAR: '',
                    });
                    handleAxisCategoryChange(axis.id, { improvementPoints: currentList });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAR ? 'إضافة معيار' : 'Ajouter un critère'}</span>
                </button>
              </div>

              {evalData.improvementPoints.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 bg-rose-50/30">
                  {isAR ? 'لم يتم إضافة أي نقاط تطوير بعد' : 'Aucun point à améliorer ajouté pour le moment.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evalData.improvementPoints.map((currentObs, slotIdx) => (
                    <div
                      key={currentObs.id || slotIdx}
                      className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-800 dark:text-rose-300">
                        <span>{isAR ? `نقطة تطوير #${slotIdx + 1}` : `Point Amélioration #${slotIdx + 1}`}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">{isAR ? 'دقيقة' : 'Min'}</span>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={currentObs?.minute || ''}
                              onChange={(e) =>
                                handleObservationChange(
                                  'IMPROVEMENT',
                                  slotIdx,
                                  currentObs?.criterionId || '',
                                  parseInt(e.target.value) || undefined
                                )
                              }
                              className="w-12 px-1.5 py-0.5 text-center text-xs font-mono font-bold rounded border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                              placeholder="Min"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...evalData.improvementPoints];
                              currentList.splice(slotIdx, 1);
                              handleAxisCategoryChange(axis.id, { improvementPoints: currentList });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 font-bold"
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <select
                        value={currentObs?.criterionId || ''}
                        onChange={(e) =>
                          handleObservationChange(
                            'IMPROVEMENT',
                            slotIdx,
                            e.target.value,
                            currentObs?.minute
                          )
                        }
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      >
                        <option value="">{isAR ? '-- اختر نقطة تحسين --' : '-- Choisir un point à améliorer --'}</option>
                        {fallbackCriteria.map((crit) => (
                          <option key={crit.id} value={crit.id}>
                            {isAR ? crit.textAR : crit.textFR}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAR ? 'ملاحظات وتعليقات المراقب الخاصة بالقسم:' : 'Commentaires spécifiques à cette rubrique:'}
              </label>
              <textarea
                rows={2}
                value={evalData.comments}
                onChange={(e) =>
                  handleAxisCategoryChange(axis.id, { comments: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder={isAR ? 'اكتب ملاحظات تفصيلية هنا...' : 'Remarques détaillées de l inspecteur...'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
