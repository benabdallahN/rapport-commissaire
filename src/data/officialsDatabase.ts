import { CompetitionItem, getStoredCompetitions } from './competitionsAndClubsData';

export const COMPETITION_HIERARCHY = [
  { id: 'comp_l1', name: 'Ligue I (Professionnelle)', rank: 1 },
  { id: 'comp_l2', name: 'Ligue II (Professionnelle)', rank: 2 },
  { id: 'comp_lna1', name: 'Ligue Amateur Nationale 1', rank: 3 },
  { id: 'comp_lna2', name: 'Ligue Amateur Nationale 2', rank: 4 },
  { id: 'comp_coupe', name: 'Coupe de Tunisie', rank: 1 },
  { id: 'comp_coupe_ligue', name: 'Coupe de la Ligue', rank: 2 },
  { id: 'comp_feminin', name: 'Football Féminin National A', rank: 5 },
  { id: 'comp_jeunes', name: 'Championnat des Jeunes', rank: 6 },
  { id: 'comp_regionale', name: 'Ligue Régionale', rank: 7 },
];

export type OfficialRoleCode =
  | 'REFEREE'
  | 'ASSISTANT_1'
  | 'ASSISTANT_2'
  | 'FOURTH'
  | 'VAR'
  | 'AVAR'
  | 'INSPECTOR';

export type OfficialBaseRole = 'Central' | 'Assistant' | 'Commissaire';

/**
 * Maps any role input (code or string) to one of the 3 permanent base roles:
 * - Central (Arbitre central)
 * - Assistant (Arbitre assistant)
 * - Commissaire (Commissaire / Examinateur)
 */
export function getOfficialBaseRole(role: string | undefined | null): OfficialBaseRole {
  if (!role) return 'Central';
  const r = role.toUpperCase();
  if (
    r.includes('INSPECTOR') ||
    r.includes('COMMISSAIRE') ||
    r.includes('EXAMINATEUR') ||
    r.includes('DELEGUE') ||
    r.includes('INSPECTEUR')
  ) {
    return 'Commissaire';
  }
  if (r.includes('ASSISTANT') || r.includes('AVAR')) {
    return 'Assistant';
  }
  return 'Central';
}

/**
 * Checks if a competition is a national competition subject to advanced functions (4ème arbitre, VAR, AVAR).
 * Competitions excluded from advanced functions: Ligue Régionale, Football Féminin National A, Championnat des Jeunes.
 */
export function isNationalCompetitionWithAdvancedRoles(competitionName: string): boolean {
  if (!competitionName) return true;
  const lower = competitionName.toLowerCase();
  if (
    lower.includes('régionale') ||
    lower.includes('regionale') ||
    lower.includes('féminin') ||
    lower.includes('feminin') ||
    lower.includes('jeune') ||
    lower.includes('jeunes')
  ) {
    return false;
  }
  return true;
}

/**
 * Checks whether an official with a permanent base role can fulfill a specific match function.
 * Rules:
 * - Arbitre Central (Central) -> Arbitre central, Quatrième arbitre, VAR
 * - Arbitre Assistant (Assistant) -> Arbitre assistant 1 & 2, AVAR
 * - Commissaire / Examinateur -> Commissaire / Inspecteur
 */
export function canBaseRoleFulfillMatchFunction(
  baseRole: OfficialBaseRole,
  matchRole: OfficialRoleCode | string
): boolean {
  const m = matchRole.toUpperCase();

  if (baseRole === 'Central') {
    return (
      m === 'REFEREE' ||
      m === 'FOURTH' ||
      m === 'VAR' ||
      m.includes('CENTRAL') ||
      m.includes('QUATRIEME') ||
      m.includes('4EME')
    );
  }
  if (baseRole === 'Assistant') {
    return (
      m === 'ASSISTANT_1' ||
      m === 'ASSISTANT_2' ||
      m === 'AVAR' ||
      m.includes('ASSISTANT')
    );
  }
  if (baseRole === 'Commissaire') {
    return (
      m === 'INSPECTOR' ||
      m.includes('COMMISSAIRE') ||
      m.includes('INSPECTEUR') ||
      m.includes('EXAMINATEUR')
    );
  }
  return false;
}

/**
 * Filter list of officials for a specific match function in a given competition.
 */
export function getEligibleOfficialsForMatchFunction(
  officials: OfficialFullRecord[],
  matchRole: OfficialRoleCode | string,
  matchCompInput: CompetitionItem | string,
  competitionsList?: CompetitionItem[]
): OfficialFullRecord[] {
  return officials.filter((off) => {
    // 1. Competition eligibility check
    const isCompEligible = isOfficialEligibleForMatchCompetition(off, matchCompInput, competitionsList);
    if (!isCompEligible) return false;

    // 2. Base role suitability for this match function
    const baseRole = getOfficialBaseRole(off.role);
    return canBaseRoleFulfillMatchFunction(baseRole, matchRole);
  });
}

export interface OfficialFullRecord {
  id: string;
  nom: string;
  prenom: string;
  fullName: string;
  fullNameAR?: string; // Nom et prénom en arabe
  nameAR?: string;
  nomAR?: string;
  prenomAR?: string;
  dateNaissance?: string; // YYYY-MM-DD
  role: OfficialRoleCode | 'Central' | 'Assistant' | 'Commissaire' | 'Quatrième' | 'VAR' | 'AVAR';
  ligueRegionale: string;
  grade: string;
  telephoneWhatsapp?: string;
  email?: string;
  cin?: string; // Carte d'Identité Nationale
  competitionAppartenance: string; // Compétition d'appartenance / niveau maximal (e.g. 'Ligue I (Professionnelle)')
  competitionIds?: string[]; // IDs des compétitions autorisées (Relation Officiel ↔ Compétition)
  matchesCount?: number;
  averageScore?: number;
  status?: 'ACTIVE' | 'SUSPENDED' | 'TRAINING';
  isUserAccountCreated?: boolean;
}

export const INITIAL_OFFICIALS: OfficialFullRecord[] = [
  {
    id: 'off_naim',
    nom: 'Hosni',
    prenom: 'Naim',
    fullName: 'Naim Hosni',
    fullNameAR: 'نعيم حسني',
    nameAR: 'نعيم حسني',
    dateNaissance: '1988-04-12',
    role: 'REFEREE',
    ligueRegionale: 'Tunis',
    grade: 'International (FIFA)',
    telephoneWhatsapp: '+216 98 123 456',
    email: 'arbitre.naim@ftf.org.tn',
    cin: '08123456',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 14,
    averageScore: 8.42,
    status: 'ACTIVE',
  },
  {
    id: 'off_amir',
    nom: 'Loussif',
    prenom: 'Amir',
    fullName: 'Amir Loussif',
    fullNameAR: 'أمير اللوصيف',
    nameAR: 'أمير اللوصيف',
    dateNaissance: '1990-09-25',
    role: 'REFEREE',
    ligueRegionale: 'Kairouan',
    grade: 'Fédéral',
    telephoneWhatsapp: '+216 97 234 567',
    email: 'amir.loussif@ftf.org.tn',
    cin: '07234567',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 11,
    averageScore: 8.15,
    status: 'ACTIVE',
  },
  {
    id: 'off_mahrez',
    nom: 'Melki',
    prenom: 'Mahrez',
    fullName: 'Mahrez Melki',
    fullNameAR: 'محرز المالكي',
    nameAR: 'محرز المالكي',
    dateNaissance: '1992-01-15',
    role: 'REFEREE',
    ligueRegionale: 'Nord (Bizerte)',
    grade: 'Fédéral',
    telephoneWhatsapp: '+216 22 345 678',
    email: 'mahrez.melki@ftf.org.tn',
    cin: '06345678',
    competitionAppartenance: 'Ligue II (Professionnelle)',
    competitionIds: ['comp_l2'],
    matchesCount: 9,
    averageScore: 8.28,
    status: 'ACTIVE',
  },
  {
    id: 'off_anouar',
    nom: 'Hmila',
    prenom: 'Anouar',
    fullName: 'Anouar Hmila',
    fullNameAR: 'أنور هميلة',
    nameAR: 'أنور هميلة',
    dateNaissance: '1986-11-03',
    role: 'ASSISTANT_1',
    ligueRegionale: 'Centre (Sousse)',
    grade: 'International (FIFA)',
    telephoneWhatsapp: '+216 98 456 789',
    email: 'anouar.hmila@ftf.org.tn',
    cin: '05456789',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 16,
    averageScore: 8.55,
    status: 'ACTIVE',
  },
  {
    id: 'off_aymen',
    nom: 'Ismail',
    prenom: 'Aymen',
    fullName: 'Aymen Ismail',
    fullNameAR: 'أيمن إسماعيل',
    nameAR: 'أيمن إسماعيل',
    dateNaissance: '1991-06-20',
    role: 'ASSISTANT_2',
    ligueRegionale: 'Sud (Sfax)',
    grade: 'Fédéral',
    telephoneWhatsapp: '+216 24 567 890',
    email: 'aymen.ismail@ftf.org.tn',
    cin: '04567890',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 12,
    averageScore: 8.35,
    status: 'ACTIVE',
  },
  {
    id: 'off_faouzi',
    nom: 'Jridi',
    prenom: 'Faouzi',
    fullName: 'Faouzi Jridi',
    fullNameAR: 'فوزي الجريدي',
    nameAR: 'فوزي الجريدي',
    dateNaissance: '1993-08-08',
    role: 'ASSISTANT_1',
    ligueRegionale: 'Nabeul',
    grade: '1ère Série',
    telephoneWhatsapp: '+216 55 678 901',
    email: 'faouzi.jridi@ftf.org.tn',
    cin: '03678901',
    competitionAppartenance: 'Ligue II (Professionnelle)',
    competitionIds: ['comp_l2'],
    matchesCount: 8,
    averageScore: 8.10,
    status: 'ACTIVE',
  },
  {
    id: 'off_mohamed',
    nom: 'Ben Hassine',
    prenom: 'Mohamed Ali',
    fullName: 'Mohamed Ali Ben Hassine',
    fullNameAR: 'محمد علي بن حسين',
    nameAR: 'محمد علي بن حسين',
    dateNaissance: '1975-03-30',
    role: 'INSPECTOR',
    ligueRegionale: 'Tunis',
    grade: 'Commissaire / Inspecteur Fédéral',
    telephoneWhatsapp: '+216 98 888 999',
    email: 'assesseurstunisie@gmail.com',
    cin: '01888999',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 18,
    averageScore: 8.80,
    status: 'ACTIVE',
    isUserAccountCreated: true,
  },
  {
    id: 'off_ridha',
    nom: 'Bouglia',
    prenom: 'Ridha',
    fullName: 'Ridha Bouglia',
    fullNameAR: 'رضا بوقلية',
    nameAR: 'رضا بوقلية',
    dateNaissance: '1972-12-14',
    role: 'INSPECTOR',
    ligueRegionale: 'Tunis',
    grade: 'Commissaire / Inspecteur Fédéral',
    telephoneWhatsapp: '+216 98 777 666',
    email: 'ridha.bouglia@ftf.org.tn',
    cin: '01777666',
    competitionAppartenance: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1'],
    matchesCount: 15,
    averageScore: 8.65,
    status: 'ACTIVE',
  },
  {
    id: 'off_walid',
    nom: 'Baccouche',
    prenom: 'Walid',
    fullName: 'Walid Baccouche',
    fullNameAR: 'وليد بقوش',
    nameAR: 'وليد بقوش',
    dateNaissance: '1995-05-18',
    role: 'REFEREE',
    ligueRegionale: 'Ligue Régionale',
    grade: '2ème Série',
    telephoneWhatsapp: '+216 29 111 222',
    email: 'walid.baccouche@ftf.org.tn',
    cin: '09111222',
    competitionAppartenance: 'Ligue Régionale',
    competitionIds: ['comp_lr'],
    matchesCount: 6,
    averageScore: 7.95,
    status: 'ACTIVE',
  },
];

const OFFICIALS_STORAGE_KEY = 'ftf_officials_v2';

export function getStoredOfficials(): OfficialFullRecord[] {
  try {
    const raw = localStorage.getItem(OFFICIALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load officials from localStorage', e);
  }
  return INITIAL_OFFICIALS;
}

export function saveStoredOfficials(officials: OfficialFullRecord[]): void {
  try {
    localStorage.setItem(OFFICIALS_STORAGE_KEY, JSON.stringify(officials));
  } catch (e) {
    console.error('Failed to save officials to localStorage', e);
  }
}

/**
 * Helper to check if an official is eligible to officiate in a match of a specific competition.
 * Rule: An official authorized for a competition of rank R is eligible for that competition
 * and ALL competitions of rank >= R (lower level in hierarchy).
 */
export function isOfficialEligibleForMatchCompetition(
  official: OfficialFullRecord,
  matchCompInput: CompetitionItem | string,
  competitionsList?: CompetitionItem[]
): boolean {
  const comps = competitionsList || getStoredCompetitions();

  let matchComp: CompetitionItem | undefined;
  if (typeof matchCompInput === 'string') {
    const inputLower = matchCompInput.toLowerCase().trim();
    matchComp = comps.find(
      (c) =>
        c.id === matchCompInput ||
        c.nameFR.toLowerCase() === inputLower ||
        c.nameAR.toLowerCase() === inputLower ||
        c.abbreviation.toLowerCase() === inputLower ||
        inputLower.includes(c.nameFR.toLowerCase())
    );
  } else {
    matchComp = matchCompInput;
  }

  // If match competition is not found or has no rank, default match rank to 1
  const matchRank = matchComp ? matchComp.rank : 1;

  // 1. Direct association check via competitionIds
  if (matchComp && official.competitionIds && official.competitionIds.includes(matchComp.id)) {
    return true;
  }

  // 2. Hierarchy rule check:
  const authorizedRanks: number[] = [];

  if (official.competitionIds && official.competitionIds.length > 0) {
    official.competitionIds.forEach((compId) => {
      const c = comps.find((item) => item.id === compId);
      if (c) authorizedRanks.push(c.rank);
    });
  }

  if (official.competitionAppartenance) {
    const appLower = official.competitionAppartenance.toLowerCase().trim();
    const c = comps.find(
      (item) =>
        item.nameFR.toLowerCase().includes(appLower) ||
        appLower.includes(item.nameFR.toLowerCase())
    );
    if (c) authorizedRanks.push(c.rank);
  }

  if (authorizedRanks.length === 0) {
    authorizedRanks.push(1); // Default to rank 1 (Ligue I)
  }

  const minOfficialRank = Math.min(...authorizedRanks);

  // Lower level competitions have HIGHER rank numbers.
  // Rank 1 (Ligue I) <= Rank 2 (Ligue II).
  // So official with minOfficialRank=1 can officiate in matchRank=1, 2, 3, etc. (matchRank >= minOfficialRank).
  return matchRank >= minOfficialRank;
}

