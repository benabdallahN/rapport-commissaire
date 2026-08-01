import { Language } from '../types';

/**
 * Calculates weighted referee score:
 * (Personnalité + Condition Physique*2 + Interprétation des lois*3) / 6
 */
export function calculateWeightedRefereeScore(
  personality: number,
  physical: number,
  laws: number
): number {
  if (!personality || !physical || !laws) return 8.0;
  const raw = (personality + physical * 2 + laws * 3) / 6;
  return Math.round(raw * 100) / 100;
}

/**
 * Exact performance label lookup table based on score ranges
 */
export function getPerformanceLabel(
  score: number,
  lang: Language = 'FR'
): { textFR: string; textAR: string; badgeColor: string } {
  if (score >= 9.0) {
    return {
      textFR: 'Excellent',
      textAR: 'ممتاز (Excellent)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    };
  }
  if (score >= 8.5) {
    return {
      textFR: 'Très Bien',
      textAR: 'ممتاز جداً (Très Bien)',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    };
  }
  if (score >= 8.3) {
    return {
      textFR: 'Bon',
      textAR: 'جيد (Bon)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    };
  }
  if (score >= 8.2) {
    return {
      textFR: 'Satisfaisant',
      textAR: 'مرضٍ (Satisfaisant)',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    };
  }
  if (score >= 8.0) {
    return {
      textFR: "A besoin d'amélioration",
      textAR: 'يحتاج تحسين (A besoin d\'amélioration)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    };
  }
  if (score >= 7.9) {
    return {
      textFR: 'Bon avec erreur manifeste',
      textAR: 'جيد مع خطأ واضح (Bon avec erreur manifeste)',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    };
  }
  if (score >= 7.8) {
    return {
      textFR: 'Satisfaisant avec erreur manifeste',
      textAR: 'مرضٍ مع خطأ واضح (Satisfaisant avec erreur manifeste)',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    };
  }
  if (score >= 7.5) {
    return {
      textFR: 'Inattendu',
      textAR: 'غير متوقع (Inattendu)',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
    };
  }
  if (score >= 7.0) {
    return {
      textFR: 'Décevant',
      textAR: 'مخيب للأمل (Décevant)',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    };
  }
  return {
    textFR: 'Inacceptable',
    textAR: 'غير مقبول (Inacceptable)',
    badgeColor: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  };
}

/**
 * Generate 6.0 to 10.0 notes array with 0.1 steps
 */
export function generateRatingScale(): number[] {
  const scale: number[] = [];
  for (let i = 60; i <= 100; i++) {
    scale.push(i / 10);
  }
  return scale;
}
