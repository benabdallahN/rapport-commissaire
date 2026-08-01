export type CompetitionType = 'Championnat' | 'Coupe de Tunisie' | 'Coupe de la Ligue';

export interface CompetitionItem {
  id: string;
  type: CompetitionType;
  nameFR: string;
  nameAR: string;
  abbreviation: string;
  season: string;
  rank: number; // Ordre hiérarchique pour la désignation des officiels
  status: 'ACTIVE' | 'INACTIVE';
  isFreeTextMode?: boolean; // Vrai pour Ligue Régionale, Football Féminin, Jeunes (Saisie libre)
}

export interface ClubItem {
  id: string;
  abbr: string;
  nameFR: string;
  nameAR: string;
  competitionIds?: string[]; // IDs des compétitions auxquelles appartient ce club
}

export interface PracticalExamLevelItem {
  id: string;
  code: string;
  nameFR: string;
  nameAR: string;
}

export const COMPETITION_TYPES: { code: CompetitionType; nameFR: string; nameAR: string }[] = [
  { code: 'Championnat', nameFR: 'Championnat', nameAR: 'بطولة' },
  { code: 'Coupe de Tunisie', nameFR: 'Coupe de Tunisie', nameAR: 'كأس تونس' },
  { code: 'Coupe de la Ligue', nameFR: 'Coupe de la Ligue', nameAR: 'كأس الرابطة' },
];

export const INITIAL_COMPETITIONS: CompetitionItem[] = [
  {
    id: 'comp_l1',
    type: 'Championnat',
    nameFR: 'Ligue I (Professionnelle)',
    nameAR: 'الرابطة المحترفة الأولى',
    abbreviation: 'L1',
    season: '2025-2026',
    rank: 1,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
  {
    id: 'comp_l2',
    type: 'Championnat',
    nameFR: 'Ligue II (Professionnelle)',
    nameAR: 'الرابطة المحترفة الثانية',
    abbreviation: 'L2',
    season: '2025-2026',
    rank: 2,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
  {
    id: 'comp_lna1',
    type: 'Championnat',
    nameFR: 'Ligue Amateur Nationale 1',
    nameAR: 'الرابطة الوطنية للهواة ن1',
    abbreviation: 'LNA1',
    season: '2025-2026',
    rank: 3,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
  {
    id: 'comp_lna2',
    type: 'Championnat',
    nameFR: 'Ligue Amateur Nationale 2',
    nameAR: 'الرابطة الوطنية للهواة ن2',
    abbreviation: 'LNA2',
    season: '2025-2026',
    rank: 4,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
  {
    id: 'comp_lr',
    type: 'Championnat',
    nameFR: 'Ligue Régionale',
    nameAR: 'الرابطة الجهوية',
    abbreviation: 'LR',
    season: '2025-2026',
    rank: 5,
    status: 'ACTIVE',
    isFreeTextMode: true, // Cas particulier : Saisie libre par le commissaire
  },
  {
    id: 'comp_ffna',
    type: 'Championnat',
    nameFR: 'Football Féminin National A',
    nameAR: 'الكرة النسائية الوطنية أ',
    abbreviation: 'FFNA',
    season: '2025-2026',
    rank: 6,
    status: 'ACTIVE',
    isFreeTextMode: true, // Cas particulier : Saisie libre
  },
  {
    id: 'comp_cj',
    type: 'Championnat',
    nameFR: 'Championnat des Jeunes',
    nameAR: 'بطولة الشبان',
    abbreviation: 'CJ',
    season: '2025-2026',
    rank: 7,
    status: 'ACTIVE',
    isFreeTextMode: true, // Cas particulier : Saisie libre
  },
  {
    id: 'comp_ct',
    type: 'Coupe de Tunisie',
    nameFR: 'Coupe de Tunisie',
    nameAR: 'كأس تونس',
    abbreviation: 'CT',
    season: '2025-2026',
    rank: 8,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
  {
    id: 'comp_cl',
    type: 'Coupe de la Ligue',
    nameFR: 'Coupe de la Ligue',
    nameAR: 'كأس الرابطة',
    abbreviation: 'CL',
    season: '2025-2026',
    rank: 9,
    status: 'ACTIVE',
    isFreeTextMode: false,
  },
];

export const INITIAL_CLUBS: ClubItem[] = [
  { id: 'club_ca', abbr: 'CA', nameFR: 'Club Africain', nameAR: 'النادي الإفريقي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_est', abbr: 'EST', nameFR: 'Espérance Sportive de Tunis', nameAR: 'الترجي الرياضي التونسي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_css', abbr: 'CSS', nameFR: 'Club Sportif Sfaxien', nameAR: 'النادي الرياضي الصفاقسي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_st', abbr: 'ST', nameFR: 'Stade Tunisien', nameAR: 'الملعب التونسي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_usmo', abbr: 'USMO', nameFR: 'Union Sportive Monastirienne', nameAR: 'الاتحاد الرياضي المنستيري', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_esz', abbr: 'ESZ', nameFR: 'Espérance Sportive de Zarzis', nameAR: 'الترجي الرياضي الجرجيسي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_ess', abbr: 'ESS', nameFR: 'Étoile Sportive du Sahel', nameAR: 'النجم الرياضي الساحلي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_esm', abbr: 'ESM', nameFR: 'Étoile Sportive de Métlaoui', nameAR: 'النجم الرياضي بالمتلوي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_jso', abbr: 'JSO', nameFR: "Jeunesse Sportive d'El Omrane", nameAR: 'الشبيبة الرياضية بالعمران', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_usbg', abbr: 'USBG', nameFR: 'Union Sportive de Ben Guerdane', nameAR: 'الاتحاد الرياضي ببن قردان', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_asm', abbr: 'ASM', nameFR: 'Avenir Sportif de La Marsa', nameAR: 'المستقبل الرياضي بالمرسى', competitionIds: ['comp_l1', 'comp_l2', 'comp_ct', 'comp_cl'] },
  { id: 'club_cab', abbr: 'CAB', nameFR: 'Club Athlétique Bizertin', nameAR: 'النادي الرياضي البنزرتي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_ob', abbr: 'OB', nameFR: 'Olympique de Béja', nameAR: 'الأولمبي الباجي', competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'] },
  { id: 'club_eshs', abbr: 'ESHS', nameFR: 'Espoir Sportif de Hammam Sousse', nameAR: 'الأمل الرياضي بحمام سوسة', competitionIds: ['comp_l2', 'comp_ct', 'comp_cl'] },
  { id: 'club_psse', abbr: 'PSSE', nameFR: 'Palm Sports de Sakiet Eddaïer', nameAR: 'التقدم الرياضي بساقية الداير', competitionIds: ['comp_lna1', 'comp_ct', 'comp_cl'] },
  { id: 'club_cshl', abbr: 'CSHL', nameFR: 'Club Sportif de Hammam Lif', nameAR: 'النادي الرياضي بحمام الأنف', competitionIds: ['comp_l2', 'comp_ct', 'comp_cl'] },
];

export const INITIAL_PRACTICAL_EXAM_LEVELS: PracticalExamLevelItem[] = [
  { id: 'ex_1', code: 'FEDERAL', nameFR: 'Examen Fédéral', nameAR: 'امتحان فيدرالي' },
  { id: 'ex_2', code: 'SERIE_1', nameFR: 'Examen 1ère Série', nameAR: 'امتحان درجة أولى' },
  { id: 'ex_3', code: 'SERIE_2', nameFR: 'Examen 2ème Série', nameAR: 'امتحان درجة ثانية' },
];

// LocalStorage Keys
const COMPETITIONS_KEY = 'ftf_competitions_v2';
const CLUBS_KEY = 'ftf_clubs_v2';
const EXAM_LEVELS_KEY = 'ftf_exam_levels_v2';

export function getStoredCompetitions(): CompetitionItem[] {
  try {
    const data = localStorage.getItem(COMPETITIONS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load competitions', e);
  }
  return INITIAL_COMPETITIONS;
}

export function saveStoredCompetitions(list: CompetitionItem[]): void {
  try {
    localStorage.setItem(COMPETITIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save competitions', e);
  }
}

export function getStoredClubs(): ClubItem[] {
  try {
    const data = localStorage.getItem(CLUBS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load clubs', e);
  }
  return INITIAL_CLUBS;
}

export function saveStoredClubs(list: ClubItem[]): void {
  try {
    localStorage.setItem(CLUBS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save clubs', e);
  }
}

export function getStoredExamLevels(): PracticalExamLevelItem[] {
  try {
    const data = localStorage.getItem(EXAM_LEVELS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load exam levels', e);
  }
  return INITIAL_PRACTICAL_EXAM_LEVELS;
}

export function saveStoredExamLevels(list: PracticalExamLevelItem[]): void {
  try {
    localStorage.setItem(EXAM_LEVELS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save exam levels', e);
  }
}

// Utility function to check if competition requires free text input
export function isCompetitionFreeText(competitionName: string): boolean {
  if (!competitionName) return false;
  const nameLower = competitionName.toLowerCase();
  
  // Check special cases explicitly stated in specs:
  // - Ligue Régionale
  // - Football Féminin National A
  // - Championnat des Jeunes
  if (
    nameLower.includes('régionale') ||
    nameLower.includes('regionale') ||
    nameLower.includes('féminin') ||
    nameLower.includes('feminin') ||
    nameLower.includes('jeunes')
  ) {
    return true;
  }

  const competitions = getStoredCompetitions();
  const matched = competitions.find(
    (c) =>
      c.nameFR.toLowerCase() === nameLower ||
      c.nameAR.toLowerCase() === nameLower ||
      c.abbreviation.toLowerCase() === nameLower
  );

  return matched?.isFreeTextMode ?? false;
}

// Get filtered clubs for a given competition
export function getClubsForCompetition(competitionName: string): ClubItem[] {
  const allClubs = getStoredClubs();
  if (!competitionName) return allClubs;

  if (isCompetitionFreeText(competitionName)) {
    return []; // Free text input mode
  }

  const competitions = getStoredCompetitions();
  const matchedComp = competitions.find(
    (c) =>
      c.nameFR.toLowerCase() === competitionName.toLowerCase() ||
      c.nameAR.toLowerCase() === competitionName.toLowerCase() ||
      c.abbreviation.toLowerCase() === competitionName.toLowerCase()
  );

  if (!matchedComp) return allClubs;

  // For Coupe de Tunisie and Coupe de la Ligue, return all clubs
  if (matchedComp.type === 'Coupe de Tunisie' || matchedComp.type === 'Coupe de la Ligue') {
    return allClubs;
  }

  // Filter by competition association
  const filtered = allClubs.filter(
    (club) =>
      !club.competitionIds ||
      club.competitionIds.length === 0 ||
      club.competitionIds.includes(matchedComp.id)
  );

  return filtered.length > 0 ? filtered : allClubs;
}
