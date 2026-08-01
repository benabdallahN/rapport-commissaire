import React, { useMemo } from 'react';
import { FullReport, Language } from '../../types';
import { getPerformanceLabel } from '../../utils/calculations';
import {
  getStoredDnaAxes,
  calculateDynamicRefereeScore,
} from '../../data/dnaAxesData';
import { Calculator, CheckCircle2, GraduationCap, Info } from 'lucide-react';

interface RecapSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const RecapSection: React.FC<RecapSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';

  const axesToUse = useMemo(() => {
    if (report.axesSnapshot && report.axesSnapshot.length > 0) {
      return report.axesSnapshot.filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return getStoredDnaAxes().filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [report.axesSnapshot]);

  const calcResult = calculateDynamicRefereeScore(report.evaluations, axesToUse, lang);
  const refScore = report.calculatedRefereeScore;
  const perf = getPerformanceLabel(refScore, lang);

  const getOfficialName = (roleStr: string) => {
    const off = report.officials.find((o) => o.role === roleStr);
    if (!off) return '---';
    return isAR ? (off.nameAR || off.name || '---') : (off.name || '---');
  };

  const getOfficialDifficulty = (roleStr: string) => {
    const off = report.officials.find((o) => o.role === roleStr);
    return off?.difficultyLevel || report.difficultyLevel || 'MOYENNE';
  };

  const getDifficultyLabel = (diffKey: string) => {
    if (diffKey === 'ELEVEE') return isAR ? 'عالية' : 'Élevé';
    if (diffKey === 'MOYENNE') return isAR ? 'متوسطة' : 'Moyen';
    return isAR ? 'سهلة' : 'Facile';
  };

  const officialsList = [
    {
      roleKey: 'REFEREE',
      roleLabelFR: 'Arbitre central',
      roleLabelAR: 'الحكم الرئيسي',
      score: refScore,
      scoreFormatted: refScore.toFixed(2),
      isCalculated: true,
      examInfo: report.practicalExams?.referee,
      appreciationFR: perf.textFR,
      appreciationAR: perf.textAR,
      badgeColor: perf.badgeColor,
    },
    {
      roleKey: 'ASSISTANT_1',
      roleLabelFR: 'Arbitre assistant 1',
      roleLabelAR: 'الحكم المساعد 1',
      score: report.evaluations.assistant1.score,
      scoreFormatted: report.evaluations.assistant1.score.toFixed(1),
      isCalculated: false,
      examInfo: report.practicalExams?.assistant1,
      appreciationFR: report.evaluations.assistant1.score >= 8.2 ? 'Satisfaisant ou +' : 'À améliorer',
      appreciationAR: report.evaluations.assistant1.score >= 8.2 ? 'مرضٍ أو أعلى' : 'يحتاج تحسين',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      roleKey: 'ASSISTANT_2',
      roleLabelFR: 'Arbitre assistant 2',
      roleLabelAR: 'الحكم المساعد 2',
      score: report.evaluations.assistant2.score,
      scoreFormatted: report.evaluations.assistant2.score.toFixed(1),
      isCalculated: false,
      examInfo: report.practicalExams?.assistant2,
      appreciationFR: report.evaluations.assistant2.score >= 8.2 ? 'Satisfaisant ou +' : 'À améliorer',
      appreciationAR: report.evaluations.assistant2.score >= 8.2 ? 'مرضٍ أو أعلى' : 'يحتاج تحسين',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      roleKey: 'FOURTH',
      roleLabelFR: '4ème Officiel',
      roleLabelAR: 'الحكم الرابع',
      score: report.evaluations.fourthOfficial.score,
      scoreFormatted: report.evaluations.fourthOfficial.score.toFixed(1),
      isCalculated: false,
      examInfo: report.practicalExams?.fourthOfficial,
      appreciationFR: report.evaluations.fourthOfficial.score >= 8.2 ? 'Satisfaisant ou +' : 'À améliorer',
      appreciationAR: report.evaluations.fourthOfficial.score >= 8.2 ? 'مرضٍ أو أعلى' : 'يحتاج تحسين',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Big Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isAR ? 'ملخص تقييم أداء الطاقم التحكيمي' : 'Récapitulatif des Notes & Évaluations'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAR
                  ? 'جدول تلخيص الأعداد والتقدير النهائي بجميع الفئات بناءً على السلم الرسمي'
                  : 'Synthese officielle des notes attribuées et grille d appréciation DNA'}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
              <tr>
                <th className="p-3">{isAR ? 'اسم الحكم' : 'Arbitre'}</th>
                <th className="p-3">{isAR ? 'الرتبة / الدور' : 'Rôle'}</th>
                <th className="p-3 text-center">{isAR ? 'العدد' : 'Note'}</th>
                <th className="p-3">{isAR ? 'التقدير النهائي' : 'Appréciation'}</th>
                <th className="p-3 text-center">{isAR ? 'درجة الصعوبة' : 'Difficulté'}</th>
                <th className="p-3 text-center">{isAR ? 'امتحان تطبيقي' : 'Examen pratique'}</th>
                <th className="p-3">{isAR ? 'مستوى الامتحان' : 'Niveau'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
              {officialsList.map((off) => {
                const isExam = off.examInfo?.isExam || false;
                const examLevel = off.examInfo?.examLevel || '—';

                return (
                  <tr
                    key={off.roleKey}
                    className={off.roleKey === 'REFEREE' ? 'bg-red-50/30 dark:bg-red-950/20 font-semibold' : ''}
                  >
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {getOfficialName(off.roleKey)}
                    </td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                      {isAR ? off.roleLabelAR : off.roleLabelFR}
                    </td>
                    <td className="p-3 text-center font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                      {off.scoreFormatted}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${off.badgeColor}`}>
                        {isAR ? off.appreciationAR : off.appreciationFR}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800">
                        {getDifficultyLabel(getOfficialDifficulty(off.roleKey))}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {isExam ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-700">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isAR ? 'نعم' : 'Oui'}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">{isAR ? 'لا' : 'Non'}</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {isExam ? examLevel : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Formula Explainer Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                {isAR ? 'معادلة احتساب عدد الحكم الرئيسي (DNA):' : 'Formule officielle de pondération DNA :'}
              </span>
              <span className="text-amber-700 dark:text-amber-300 font-mono font-bold">
                Note = {isAR ? calcResult.formulaStrAR : calcResult.formulaStrFR}
              </span>
            </div>
          </div>
          <div className="text-xs font-mono bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            {calcResult.breakdownStr} = <b className="text-amber-600 dark:text-amber-400">{calcResult.score.toFixed(2)}</b>
          </div>
        </div>

        {/* General Comments */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {isAR ? 'الخلاصة والتوصيات العامة للمستشار المراقب:' : 'Commentaires généraux & Synthèse globale du match:'}
          </label>
          <textarea
            rows={4}
            value={report.generalComments}
            onChange={(e) => onChange({ generalComments: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder={isAR ? 'أدخل ملاحظاتك الختامية حول المباراة...' : 'Synthèse finale de l inspection...'}
          />
        </div>
      </div>
    </div>
  );
};
