import React from 'react';
import {
  CategoryEvaluation,
  EvaluationObservation,
  FullReport,
  Language,
} from '../../types';
import { EVALUATION_CRITERIA } from '../../data/mockData';
import { getStoredExamLevels } from '../../data/competitionsAndClubsData';
import { generateRatingScale } from '../../utils/calculations';
import { Medal, PlusCircle, AlertCircle, GraduationCap } from 'lucide-react';

interface AssistantsEvalSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const AssistantsEvalSection: React.FC<AssistantsEvalSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';
  const ratingScale = generateRatingScale();
  const examLevels = getStoredExamLevels();

  const handleAssistantChange = (
    key: 'assistant1' | 'assistant2' | 'fourthOfficial',
    updated: Partial<CategoryEvaluation>
  ) => {
    const current = report.evaluations[key];
    const newCat: CategoryEvaluation = { ...current, ...updated };

    onChange({
      evaluations: {
        ...report.evaluations,
        [key]: newCat,
      },
    });
  };

  const handleExamChange = (
    key: 'assistant1' | 'assistant2' | 'fourthOfficial',
    isExam: boolean,
    examLevel?: string
  ) => {
    const currentExams = report.practicalExams || {};
    const currentOff = currentExams[key] || { isExam: false, examLevel: 'Examen Fédéral' };
    
    onChange({
      practicalExams: {
        ...currentExams,
        [key]: {
          isExam,
          examLevel: examLevel ?? currentOff.examLevel ?? 'Examen Fédéral',
        },
      },
    });
  };

  const handleDifficultyChange = (
    key: 'assistant1' | 'assistant2' | 'fourthOfficial',
    diff: 'FACILE' | 'MOYENNE' | 'ELEVEE'
  ) => {
    const roleMap = {
      assistant1: 'ASSISTANT_1' as const,
      assistant2: 'ASSISTANT_2' as const,
      fourthOfficial: 'FOURTH' as const,
    };
    const role = roleMap[key];
    const updatedOfficials = report.officials.map((o) =>
      o.role === role ? { ...o, difficultyLevel: diff } : o
    );
    onChange({ officials: updatedOfficials });
  };

  const assistants = [
    {
      key: 'assistant1' as const,
      titleFR: '1. Évaluation de l\'Arbitre Assistant 1',
      titleAR: '1. تقييم الحكم المساعد الأول (1)',
      catId: 'ASSISTANTS',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      key: 'assistant2' as const,
      titleFR: '2. Évaluation de l\'Arbitre Assistant 2',
      titleAR: '2. تقييم الحكم المساعد الثاني (2)',
      catId: 'ASSISTANTS',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      key: 'fourthOfficial' as const,
      titleFR: '3. Évaluation du 4ème Officiel',
      titleAR: '3. تقييم الحكم الرابع',
      catId: 'FOURTH',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300',
    },
  ];

  return (
    <div className="space-y-6">
      {assistants.map((item) => {
        const evalData = report.evaluations[item.key];
        const examData = report.practicalExams?.[item.key] || { isExam: false, examLevel: 'Examen Fédéral' };
        const categoryCriteria = EVALUATION_CRITERIA.filter(
          (c) => c.categoryId === item.catId
        );

        const handleObservationChange = (
          type: 'POSITIVE' | 'IMPROVEMENT',
          slotIndex: number,
          criterionId: string,
          minute?: number
        ) => {
          const crit = categoryCriteria.find((c) => c.id === criterionId);
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
            handleAssistantChange(item.key, { positiveAspects: currentList });
          } else {
            handleAssistantChange(item.key, { improvementPoints: currentList });
          }
        };

        return (
          <div
            key={item.key}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <Medal className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {isAR ? item.titleAR : item.titleFR}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {isAR ? 'تقييم فردي' : 'Évaluation Individuelle'}
                    </span>

                    {/* Individual Difficulty Selector */}
                    {(() => {
                      const roleMap = { assistant1: 'ASSISTANT_1', assistant2: 'ASSISTANT_2', fourthOfficial: 'FOURTH' } as const;
                      const offObj = report.officials.find((o) => o.role === roleMap[item.key]);
                      const offDiff = offObj?.difficultyLevel || report.difficultyLevel || 'MOYENNE';

                      return (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                          <span className="text-amber-800 dark:text-amber-300">{isAR ? 'الصعوبة:' : 'Diff :'}</span>
                          <select
                            value={offDiff}
                            onChange={(e) => handleDifficultyChange(item.key, e.target.value as any)}
                            className="bg-transparent text-amber-900 dark:text-amber-200 font-bold focus:outline-none"
                          >
                            <option value="FACILE">{isAR ? 'سهلة' : 'Facile'}</option>
                            <option value="MOYENNE">{isAR ? 'متوسطة' : 'Moyenne'}</option>
                            <option value="ELEVEE">{isAR ? 'عالية' : 'Élevée'}</option>
                          </select>
                        </div>
                      );
                    })()}

                    {/* Practical Exam Badge Toggle */}
                    <label className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={examData.isExam}
                        onChange={(e) => handleExamChange(item.key, e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>{isAR ? 'امتحان تطبيقي' : 'Examen pratique'}</span>
                    </label>

                    {examData.isExam && (
                      <select
                        value={examData.examLevel}
                        onChange={(e) => handleExamChange(item.key, true, e.target.value)}
                        className="px-2 py-0.5 text-[11px] font-bold rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 focus:outline-none"
                      >
                        {examLevels.map((lvl) => (
                          <option key={lvl.id} value={lvl.nameFR}>
                            {isAR ? lvl.nameAR : lvl.nameFR}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Selector */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAR ? 'العدد /10:' : 'Note /10:'}
                </label>
                <select
                  value={evalData.score}
                  onChange={(e) =>
                    handleAssistantChange(item.key, {
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
                  <span>{isAR ? 'الجوانب الإيجابية (إضافة ديناميكية)' : 'Aspects Positifs (Gestion Dynamique)'}</span>
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
                    handleAssistantChange(item.key, { positiveAspects: currentList });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAR ? 'إضافة معيار' : 'Ajouter un critère'}</span>
                </button>
              </div>

              {evalData.positiveAspects.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/30">
                  {isAR ? 'لم يتم إضافة أي جوانب إيجابية بعد' : 'Aucun aspect positif ajouté.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evalData.positiveAspects.map((currentObs, slotIdx) => (
                    <div
                      key={currentObs.id || slotIdx}
                      className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        <span>{isAR ? `إيجابية #${slotIdx + 1}` : `Positif #${slotIdx + 1}`}</span>
                        <div className="flex items-center gap-2">
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
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...evalData.positiveAspects];
                              currentList.splice(slotIdx, 1);
                              handleAssistantChange(item.key, { positiveAspects: currentList });
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950"
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
                        <option value="">{isAR ? '-- اختر معياراً إيجابياً --' : '-- Choisir un critère positif --'}</option>
                        {categoryCriteria.map((crit) => (
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
                  <span>{isAR ? 'نقاط التطوير (إضافة ديناميكية)' : 'Points à Améliorer (Gestion Dynamique)'}</span>
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
                    handleAssistantChange(item.key, { improvementPoints: currentList });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAR ? 'إضافة معيار' : 'Ajouter un critère'}</span>
                </button>
              </div>

              {evalData.improvementPoints.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 bg-rose-50/30">
                  {isAR ? 'لم يتم إضافة أي نقاط تطوير بعد' : 'Aucun point à améliorer ajouté.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evalData.improvementPoints.map((currentObs, slotIdx) => (
                    <div
                      key={currentObs.id || slotIdx}
                      className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-800 dark:text-rose-300">
                        <span>{isAR ? `تطوير #${slotIdx + 1}` : `Amélioration #${slotIdx + 1}`}</span>
                        <div className="flex items-center gap-2">
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
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...evalData.improvementPoints];
                              currentList.splice(slotIdx, 1);
                              handleAssistantChange(item.key, { improvementPoints: currentList });
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950"
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
                        {categoryCriteria.map((crit) => (
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
                {isAR ? 'ملاحظات وتعليقات المراقب الخاصة بالفرد:' : 'Commentaires spécifiques:'}
              </label>
              <textarea
                rows={2}
                value={evalData.comments}
                onChange={(e) =>
                  handleAssistantChange(item.key, { comments: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder={isAR ? 'اكتب ملاحظات تفصيلية هنا...' : 'Remarques de l inspecteur...'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
