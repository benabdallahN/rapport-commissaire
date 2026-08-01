import { CategoryEvaluation, Language } from '../types';
import { getPerformanceLabel } from '../utils/calculations';

export interface DnaEvaluationAxis {
  id: string; // e.g. 'personality', 'physical', 'laws', or custom 'axis_123'
  code: string; // e.g. 'PERSONALITY', 'PHYSICAL', 'LAWS'
  titleFR: string;
  titleAR: string;
  descriptionFR?: string;
  descriptionAR?: string;
  coefficient: number; // e.g. 1, 2, 3, 4
  isActive: boolean; // active = shown in form & included in formula calculation
  displayOrder: number; // 1, 2, 3...
  badgeColor?: string;
  isBuiltIn?: boolean;
}

export const DEFAULT_DNA_AXES: DnaEvaluationAxis[] = [
  {
    id: 'personality',
    code: 'PERSONALITY',
    titleFR: 'Personnalité & Autorité',
    titleAR: 'الشخصية والقيادة',
    descriptionFR: 'Contrôle du match, autorité, gestion des joueurs et du banc',
    descriptionAR: 'إدارة المباراة، القيادة، والتعامل مع اللاعبين وبنك الاحتياط',
    coefficient: 1,
    isActive: true,
    displayOrder: 1,
    badgeColor: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300',
    isBuiltIn: true,
  },
  {
    id: 'physical',
    code: 'PHYSICAL',
    titleFR: 'Condition Physique & Positionnement',
    titleAR: 'اللياقة البدنية والتمركز',
    descriptionFR: 'Endurance, accélérations, diagonale de déplacement et présence sur les phases arrêtées',
    descriptionAR: 'التحمل، السرعة، القطرية والتواجد في الكرات الثابتة',
    coefficient: 2,
    isActive: true,
    displayOrder: 2,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
    isBuiltIn: true,
  },
  {
    id: 'laws',
    code: 'LAWS',
    titleFR: 'Interprétation & Application des Lois du Jeu',
    titleAR: 'تطبيق وتفسير قوانين اللعبة',
    descriptionFR: 'Fautes tactiques, sanctions disciplinaires, avantages et précision des décisions',
    descriptionAR: 'الأخطاء التكتيكية، العقوبات الإدارية، إتاحة الفرصة ودقة القرارات',
    coefficient: 3,
    isActive: true,
    displayOrder: 3,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    isBuiltIn: true,
  },
];

const STORAGE_KEY = 'dna_evaluation_axes_v2';

/**
 * Get configured axes from localStorage or fallback to defaults
 */
export function getStoredDnaAxes(): DnaEvaluationAxis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_DNA_AXES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (e) {
    console.error('Error loading DNA evaluation axes:', e);
  }
  return DEFAULT_DNA_AXES;
}

/**
 * Save configured axes to localStorage
 */
export function saveStoredDnaAxes(axes: DnaEvaluationAxis[]): void {
  try {
    const sorted = [...axes].sort((a, b) => a.displayOrder - b.displayOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error('Error saving DNA evaluation axes:', e);
  }
}

/**
 * Reset to factory DNA default axes
 */
export function resetToDefaultDnaAxes(): DnaEvaluationAxis[] {
  saveStoredDnaAxes(DEFAULT_DNA_AXES);
  return DEFAULT_DNA_AXES;
}

export interface CalculationResult {
  score: number;
  formulaStrFR: string;
  formulaStrAR: string;
  breakdownStr: string;
  activeAxes: DnaEvaluationAxis[];
  sumCoeffs: number;
  performanceFR: string;
  performanceAR: string;
}

/**
 * Dynamic referee score calculation based on active DNA axes and their coefficients
 */
export function calculateDynamicRefereeScore(
  evaluations: Record<string, CategoryEvaluation | any>,
  axesSnapshot?: DnaEvaluationAxis[],
  lang: Language = 'FR'
): CalculationResult {
  const allAxes = axesSnapshot && axesSnapshot.length > 0 ? axesSnapshot : getStoredDnaAxes();
  const activeAxes = allAxes
    .filter((a) => a.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeAxes.length === 0) {
    const defaultLabel = getPerformanceLabel(8.0, lang);
    return {
      score: 8.0,
      formulaStrFR: 'Note = 8.00 (Aucun axe actif)',
      formulaStrAR: 'العدد = 8.00 (لا توجد محاور مفعلة)',
      breakdownStr: '8.00',
      activeAxes: [],
      sumCoeffs: 1,
      performanceFR: defaultLabel.textFR,
      performanceAR: defaultLabel.textAR,
    };
  }

  let totalWeightedScore = 0;
  let sumCoeffs = 0;
  const termsFR: string[] = [];
  const termsAR: string[] = [];
  const breakdownTerms: string[] = [];

  activeAxes.forEach((axis) => {
    const evalData = evaluations[axis.id] || evaluations[axis.code.toLowerCase()];
    const scoreVal = typeof evalData?.score === 'number' ? evalData.score : 8.0;
    const coef = axis.coefficient || 1;

    totalWeightedScore += scoreVal * coef;
    sumCoeffs += coef;

    termsFR.push(`${axis.titleFR} × ${coef}`);
    termsAR.push(`${axis.titleAR} × ${coef}`);
    breakdownTerms.push(`${scoreVal.toFixed(1)}${coef > 1 ? `×${coef}` : ''}`);
  });

  const rawScore = sumCoeffs > 0 ? totalWeightedScore / sumCoeffs : 8.0;
  const finalScore = Math.round(rawScore * 100) / 100;
  const perf = getPerformanceLabel(finalScore, lang);

  const formulaStrFR = `Note = (${termsFR.join(' + ')}) / ${sumCoeffs}`;
  const formulaStrAR = `العدد = (${termsAR.join(' + ')}) / ${sumCoeffs}`;
  const breakdownStr = `(${breakdownTerms.join(' + ')}) / ${sumCoeffs} = ${finalScore.toFixed(2)}`;

  return {
    score: finalScore,
    formulaStrFR,
    formulaStrAR,
    breakdownStr,
    activeAxes,
    sumCoeffs,
    performanceFR: perf.textFR,
    performanceAR: perf.textAR,
  };
}
