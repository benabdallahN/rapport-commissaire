export interface StadiumItem {
  id: string;
  nameFR: string;
  nameAR: string;
  cityFR: string;
  cityAR: string;
  competition?: string;
  competitionIds?: string[];
}

export const INITIAL_LIGUE1_STADIUMS: StadiumItem[] = [
  {
    id: 'st_1',
    nameFR: 'Stade Municipal de Métlaoui',
    nameAR: 'الملعب البلدي بالمتلوي',
    cityFR: 'Métlaoui',
    cityAR: 'المتلوي',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_2',
    nameFR: 'Stade Hammadi Agrebi de Radès',
    nameAR: 'ملعب حمادي العقربي برادس',
    cityFR: 'Radès',
    cityAR: 'رادس',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_3',
    nameFR: 'Stade Chedly Zouiten',
    nameAR: 'ملعب الشاذلي زويتن',
    cityFR: 'Tunis',
    cityAR: 'تونس',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_l2', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_4',
    nameFR: 'Stade synthétique de Ben Guerdane',
    nameAR: 'الملعب البلدي بين قردان',
    cityFR: 'Ben Guerdane',
    cityAR: 'بن قردان',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_5',
    nameFR: 'Stade Mustapha Ben Jannet (principal) de Monastir',
    nameAR: 'ملعب مصطفى بن جنات بالمنستير',
    cityFR: 'Monastir',
    cityAR: 'المنستير',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_6',
    nameFR: 'Complexe Sportif de Zarzis',
    nameAR: 'المركب الرياضي بجرجيس',
    cityFR: 'Zarzis',
    cityAR: 'جرجيس',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_7',
    nameFR: 'Stade Bou Jomaa El Kmiti',
    nameAR: 'ملعب بوجمعة الكميتي',
    cityFR: 'Béja',
    cityAR: 'باجة',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_8',
    nameFR: 'Stade du 15 Octobre de Bizerte',
    nameAR: 'ملعب 15 أكتوبر ببنزرت',
    cityFR: 'Bizerte',
    cityAR: 'بنزرت',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_9',
    nameFR: 'Stade de La Marsa (ASM)',
    nameAR: 'ملعب عبد العزيز الشتيوي بالمرسى',
    cityFR: 'La Marsa',
    cityAR: 'المرسى',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_l2', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_10',
    nameFR: 'Stade Hédi Enneifer (Le Bardo)',
    nameAR: 'ملعب الهادي النيفر بباردو',
    cityFR: 'Le Bardo',
    cityAR: 'باردو',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_11',
    nameFR: 'Stade Olympique de Sousse',
    nameAR: 'الملعب الأولمبي بسوسة',
    cityFR: 'Sousse',
    cityAR: 'سوسة',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_12',
    nameFR: 'Stade Taïeb Mhiri de Sfax',
    nameAR: 'ملعب الطيب المهيري بصفاقس',
    cityFR: 'Sfax',
    cityAR: 'صفاقس',
    competition: 'Ligue I (Professionnelle)',
    competitionIds: ['comp_l1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_13',
    nameFR: 'Stade Bou Ali Lahouar de Hammam Sousse',
    nameAR: 'ملعب بوعلي الحوار بحمام سوسة',
    cityFR: 'Hammam Sousse',
    cityAR: 'حمام سوسة',
    competition: 'Ligue II (Professionnelle)',
    competitionIds: ['comp_l2', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_14',
    nameFR: 'Stade Municipal 20 Mars de Hammam Lif',
    nameAR: 'الملعب البلدي 20 مارس بحمام الأنف',
    cityFR: 'Hammam Lif',
    cityAR: 'حمام الأنف',
    competition: 'Ligue II (Professionnelle)',
    competitionIds: ['comp_l2', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_15',
    nameFR: 'Stade Municipal de Sakiet Eddaïer',
    nameAR: 'الملعب البلدي بساقية الداير',
    cityFR: 'Sakiet Eddaïer',
    cityAR: 'ساقية الداير',
    competition: 'Ligue Amateur Nationale 1',
    competitionIds: ['comp_lna1', 'comp_ct', 'comp_cl'],
  },
  {
    id: 'st_16',
    nameFR: 'Stade Hamda Laouani de Kairouan',
    nameAR: 'ملعب حمدة العواني بالقيروان',
    cityFR: 'Kairouan',
    cityAR: 'القيروان',
    competition: 'Ligue II (Professionnelle)',
    competitionIds: ['comp_l2', 'comp_ct', 'comp_cl'],
  },
];

const STORAGE_KEY = 'ftf_ligue1_stadiums_v1';

export function getStoredStadiums(): StadiumItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored stadiums', e);
  }
  return INITIAL_LIGUE1_STADIUMS;
}

export function saveStoredStadiums(stadiums: StadiumItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stadiums));
  } catch (e) {
    console.error('Failed to save stadiums to storage', e);
  }
}

export function getStadiumsForCompetition(competitionName: string): StadiumItem[] {
  const allStadiums = getStoredStadiums();
  if (!competitionName) return allStadiums;

  const nameLower = competitionName.toLowerCase();
  
  // Free text mode check (Ligue Régionale, Football Féminin National A, Championnat des Jeunes)
  if (
    nameLower.includes('régionale') ||
    nameLower.includes('regionale') ||
    nameLower.includes('féminin') ||
    nameLower.includes('feminin') ||
    nameLower.includes('jeunes')
  ) {
    return []; // Free text mode: no pre-set stadiums
  }

  // Import stored competitions to match ID
  const competitionsKey = 'ftf_competitions_v2';
  try {
    const rawComps = localStorage.getItem(competitionsKey);
    if (rawComps) {
      const comps = JSON.parse(rawComps);
      const matched = comps.find(
        (c: { nameFR: string; nameAR: string; abbreviation: string; id: string; isFreeTextMode?: boolean }) =>
          c.nameFR.toLowerCase() === nameLower ||
          c.nameAR.toLowerCase() === nameLower ||
          c.abbreviation.toLowerCase() === nameLower
      );

      if (matched) {
        if (matched.isFreeTextMode) return [];

        const filtered = allStadiums.filter((st) => {
          if (st.competitionIds && st.competitionIds.length > 0) {
            return st.competitionIds.includes(matched.id);
          }
          // Coupe de Tunisie / Coupe de la Ligue can play anywhere
          if (matched.type === 'Coupe de Tunisie' || matched.type === 'Coupe de la Ligue') {
            return true;
          }
          return true;
        });

        if (filtered.length > 0) return filtered;
      }
    }
  } catch (e) {
    console.error('Failed to filter stadiums for competition', e);
  }

  return allStadiums;
}

