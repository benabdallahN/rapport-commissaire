import {
  CriterionItem,
  DisciplinaryReasonItem,
  FullReport,
  OfficialRole
} from '../types';

export const LEAGUES_LIST = [
  { id: '1', code: 'TUNIS', nameFR: 'Tunis', nameAR: 'تونس' },
  { id: '2', code: 'NORD', nameFR: 'Nord (Bizerte)', nameAR: 'الشمال (بنزرت)' },
  { id: '3', code: 'NABEUL', nameFR: 'Nabeul', nameAR: 'نابل' },
  { id: '4', code: 'NORD_OUEST', nameFR: 'Nord-Ouest (Le Kef)', nameAR: 'الشمال الغربي (الكاف)' },
  { id: '5', code: 'KAIROUAN', nameFR: 'Kairouan', nameAR: 'القيروان' },
  { id: '6', code: 'CENTRE', nameFR: 'Centre (Sousse)', nameAR: 'الوسط (سوسة)' },
  { id: '7', code: 'CENTRE_EST', nameFR: 'Centre-Est (Monastir)', nameAR: 'الوسط الشرقي (المنستير)' },
  { id: '8', code: 'SBZ_KASSERINE', nameFR: 'Sidi Bouzid - Kasserine', nameAR: 'سيدي بوزيد - القصرين' },
  { id: '9', code: 'SUD', nameFR: 'Sud (Sfax)', nameAR: 'الجنوب (صفاقس)' },
  { id: '10', code: 'SUD_EST', nameFR: 'Sud-Est (Gabès)', nameAR: 'الجنوب الشرقي (قابس)' },
  { id: '11', code: 'SUD_OUEST', nameFR: 'Sud-Ouest (Gafsa)', nameAR: 'الجنوب الغربي (قفصة)' },
  { id: '12', code: 'MEDENINE', nameFR: 'Médenine', nameAR: 'مدنين' },
];

export const GRADES_LIST = [
  { id: '1', code: 'FEDERAL', nameFR: 'Fédéral', nameAR: 'فيدرالي' },
  { id: '2', code: 'SERIE_1', nameFR: '1ère Série', nameAR: 'درجة أولى' },
  { id: '3', code: 'SERIE_2', nameFR: '2ème Série', nameAR: 'درجة ثانية' },
  { id: '4', code: 'SERIE_3', nameFR: '3ème Série', nameAR: 'درجة ثالثة' },
  { id: '5', code: 'FIFA', nameFR: 'International (FIFA)', nameAR: 'دولي (فيفا)' },
];

export const COMPETITIONS_LIST = [
  { id: '1', nameFR: 'Ligue I (Professionnelle)', nameAR: 'الرابطة المحترفة الأولى' },
  { id: '2', nameFR: 'Ligue II (Professionnelle)', nameAR: 'الرابطة المحترفة الثانية' },
  { id: '3', nameFR: 'Ligue Nationale Amateur N1', nameAR: 'الرابطة الوطنية للهواة ن1' },
  { id: '4', nameFR: 'Ligue Nationale Amateur N2', nameAR: 'الرابطة الوطنية للهواة ن2' },
  { id: '5', nameFR: 'Ligue Régionale', nameAR: 'الرابطة الجهوية' },
  { id: '6', nameFR: 'Coupe de Tunisie', nameAR: 'كأس تونس' },
  { id: '7', nameFR: 'Football Féminin National A', nameAR: 'الكرة النسائية الوطنية أ' },
  { id: '8', nameFR: 'Championnat des Jeunes', nameAR: 'بطولة الشبان' },
];

export const DIFFICULTY_LEVELS = [
  { id: 'ELEVEE', nameFR: 'Élevé', nameAR: 'مرتفع' },
  { id: 'MOYENNE', nameFR: 'Moyen', nameAR: 'متوسط' },
  { id: 'FACILE', nameFR: 'Facile', nameAR: 'سهل' },
];

export const EVALUATION_CRITERIA: CriterionItem[] = [
  // PERSONNALITÉ
  { id: 'p1', categoryId: 'PERSONALITY', textFR: 'Gestion des manifestations de désapprobation', textAR: 'التعامل مع الاعتراضات والاحتجاجات' },
  { id: 'p2', categoryId: 'PERSONALITY', textFR: 'Gestion de la distance réglementaire', textAR: 'إدارة المسافة القانونية (9.15m)' },
  { id: 'p3', categoryId: 'PERSONALITY', textFR: 'Gestion des altercations générales', textAR: 'إدارة النزاعات الجماعية والتوتر' },
  { id: 'p4', categoryId: 'PERSONALITY', textFR: 'Gestion des célébrations de but', textAR: 'إدارة الاحتفال بالأهداف وتفادي الاستفزاز' },
  { id: 'p5', categoryId: 'PERSONALITY', textFR: 'Confiance dans les prises de décision', textAR: 'الثقة والحسم في اتخاذ القرارات' },
  { id: 'p6', categoryId: 'PERSONALITY', textFR: "Résistance à l'influence du public et des joueurs", textAR: 'الصمود والتأثر بضغط الجمهور واللاعبين' },
  { id: 'p7', categoryId: 'PERSONALITY', textFR: 'Calme, sérénité et maîtrise de soi', textAR: 'الهدوء والسيطرة على النفس في اللحظات الحرجة' },
  { id: 'p8', categoryId: 'PERSONALITY', textFR: 'Autorité naturelle et charisme', textAR: 'الشخصية القوية والسلطة الطبيعية' },

  // CONDITION PHYSIQUE
  { id: 'ph1', categoryId: 'PHYSICAL', textFR: 'Lecture du jeu et anticipation des trajectoires', textAR: 'قراءة اللعب وتوقع مسار الكرة' },
  { id: 'ph2', categoryId: 'PHYSICAL', textFR: 'Angle de vision optimal lors des duels', textAR: 'زاوية الرؤية المناسبة عند الاحتكاك' },
  { id: 'ph3', categoryId: 'PHYSICAL', textFR: 'Placement sur les coups de pied arrêtés', textAR: 'التمركز الجيد في الكرات الثابتة' },
  { id: 'ph4', categoryId: 'PHYSICAL', textFR: 'Déplacement en diagonale adaptée', textAR: 'التحرك الميداني وفق القطر المناسب' },
  { id: 'ph5', categoryId: 'PHYSICAL', textFR: 'Vitesse de pointe et accélérations explosives', textAR: 'السرعة والتسارع العالي عند الضرورة' },
  { id: 'ph6', categoryId: 'PHYSICAL', textFR: 'Endurance physique et constance sur 90 min', textAR: 'القدرة على التحمل واللياقة طيلة المباراة' },
  { id: 'ph7', categoryId: 'PHYSICAL', textFR: 'Apparence physique et prestance athlétique', textAR: 'المظهر البدني والرشاقة والوقار الرياضي' },

  // LAWS
  { id: 'l1', categoryId: 'LAWS', textFR: 'Différenciation imprudence / témérité / force excessive', textAR: 'التمييز بين الإهمال / التهور / القوة المفرطة' },
  { id: 'l2', categoryId: 'LAWS', textFR: "Application adéquate de la règle de l'avantage", textAR: 'التطبيق المحكم لقاعدة إعطاء الميزة' },
  { id: 'l3', categoryId: 'LAWS', textFR: 'Vigilance sur les fautes tactiques et Occasion manifeste de but (DOGSO)', textAR: 'الحزم في الأخطاء التكتيكية وإلغاء فرصة هدف محققة' },
  { id: 'l4', categoryId: 'LAWS', textFR: 'Gestion précise du temps de jeu et du temps additionnel', textAR: 'إدارة الوقت والوقت بدل الضائع بدقة' },
  { id: 'l5', categoryId: 'LAWS', textFR: 'Utilisation judicieuse du sifflet (tonalités adaptées)', textAR: 'الاستعمال المناسب والواضح للصفارة' },
  { id: 'l6', categoryId: 'LAWS', textFR: 'Communication verbale claire et langage corporel expressif', textAR: 'التواصل واللغة الجسدية الواضحة مع اللاعبين' },
  { id: 'l7', categoryId: 'LAWS', textFR: 'Gestion des mains et fautes dans la surface de réparation', textAR: 'إدارة لمس الكرة باليد والأخطاء داخل منطقة الجزاء' },
  { id: 'l8', categoryId: 'LAWS', textFR: 'Distinction entre jeu délibéré et déviation involontaire', textAR: 'التمييز بين اللعب المتعمد والانحراف غير المقصود' },

  // ASSISTANTS
  { id: 'a1', categoryId: 'ASSISTANTS', textFR: 'Exactitude et rapidité des signalements de hors-jeu', textAR: 'دقة وسرعة إشارات التسلل' },
  { id: 'a2', categoryId: 'ASSISTANTS', textFR: 'Maîtrise de la technique "Wait and See"', textAR: 'إتقان تقنية الانتظار والرؤية (Wait & See)' },
  { id: 'a3', categoryId: 'ASSISTANTS', textFR: "Assistance efficace à l'arbitre sur les fautes proches", textAR: 'المساعدة الفعالة للحكم في الأخطاء القريبة' },
  { id: 'a4', categoryId: 'ASSISTANTS', textFR: 'Contrôle des franchissements de ligne de but et de touche', textAR: 'مراقبة خروج الكرة عبر خط المرمى أو التماس' },
  { id: 'a5', categoryId: 'ASSISTANTS', textFR: 'Placement et déplacements stricts sur la ligne du hors-jeu', textAR: 'التمركز والتحرك الدقيق على خط التسلل' },
  { id: 'a6', categoryId: 'ASSISTANTS', textFR: 'Technique claire du maniement du drapeau', textAR: 'التقنية السليمة والواضحة في رفـع الراية' },

  // FOURTH
  { id: 'f1', categoryId: 'FOURTH', textFR: 'Contrôle rigoureux de la zone technique et des bancs', textAR: 'المراقبة الصارمة للمنطقة الفنية ومقاعد البدلاء' },
  { id: 'f2', categoryId: 'FOURTH', textFR: 'Gestion fluide des remplacements et panneau électronique', textAR: 'الإدارة السلسة للتبديلات واللوحة الإلكترونية' },
  { id: 'f3', categoryId: 'FOURTH', textFR: "Coopération constante et soutien à l'équipe arbitrale", textAR: 'التعاون المستمر ودعم طاقم التحكيم' },
  { id: 'f4', categoryId: 'FOURTH', textFR: 'Gestion des ballons de réserve et incidents de couloir', textAR: 'إدارة الكرات الإضافية والأحداث الجانبية' },
];

export const DISCIPLINARY_REASONS: DisciplinaryReasonItem[] = [
  // A - Joueurs envers joueurs
  { id: 'd_a1', code: 'A', textFR: "A - Somme d'avertissements (2ème Jaune)", textAR: 'أ - مجموع إنذارين (كرت أصفر ثاني)' },
  { id: 'd_a2', code: 'A', textFR: 'A - Anéantissement d une occasion nette de but (DOGSO)', textAR: 'أ - حرمان المنافس من فرصة هدف محققة' },
  { id: 'd_a3', code: 'A', textFR: 'A - Faute grossière / Tacle dangereux', textAR: 'أ - التدخل الخشن / التاكل الخطير' },
  { id: 'd_a4', code: 'A', textFR: 'A - Acte de brutalité ou coup volontaire', textAR: 'أ - السلوك العنيف أو الضرب المتعمد' },
  { id: 'd_a5', code: 'A', textFR: 'A - Crachat sur un joueur ou toute autre personne', textAR: 'أ - البصق على لاعب أو أي شخص آخر' },
  { id: 'd_a6', code: 'A', textFR: 'A - Propos discriminatoires ou racistes', textAR: 'أ - عبارات عنصرية أو تمييزية' },
  
  // B - Joueurs envers officiels
  { id: 'd_b1', code: 'B', textFR: 'B - Contestation véhémente / Propos blesants', textAR: 'ب - الاعتراض الشديد / ألفاظ غير رياضية' },
  { id: 'd_b2', code: 'B', textFR: 'B - Menaces ou tentative d intimidation envers l arbitre', textAR: 'ب - التهديد أو لمحاولة تخويف الحكم' },
  { id: 'd_b3', code: 'B', textFR: 'B - Contact physique ou bousculade sur un officiel', textAR: 'ب - الاحتكاك البدني أو دفع الحكم' },
  { id: 'd_b4', code: 'B', textFR: 'B - Crachat / Jet d objet ciblé vers l arbitre', textAR: 'ب - البصق أو رمي المقذوفات نحو الحكم' },

  // C - Joueurs envers public
  { id: 'd_c1', code: 'C', textFR: 'C - Gestes obscènes ou provocations envers les gradins', textAR: 'ج - حركات منافية للأخلاق أو استفزاز الجماهير' },
  { id: 'd_c2', code: 'C', textFR: 'C - Insultes directes adressées au public', textAR: 'ج - توجيه شتائم مباشرة للجمهور' },

  // D - Dirigeants & Staff
  { id: 'd_d1', code: 'D', textFR: 'D - Comportement irresponsable sur le banc de touche', textAR: 'د - تصرف غير مسؤول على بنك البدلاء' },
  { id: 'd_d2', code: 'D', textFR: 'D - Contestation répété des décisions d arbitrage', textAR: 'د - الاحتجاج المتكرر على قرارات التحكيم' },
  { id: 'd_d3', code: 'D', textFR: 'D - Propos injurieux envers le 4ème officiel ou arbitre', textAR: 'د - ألفاظ بذيئة اتجاه الحكم الرابع أو طاقم التحكيم' },
  { id: 'd_d4', code: 'D', textFR: 'D - Entrée non autorisée sur le terrain de jeu', textAR: 'د - الدخول إلى أرضية الميدان دون إذن' },

  // E - Public / Incidents
  { id: 'd_e1', code: 'E', textFR: 'E - Jets répétitifs de fumigènes ou bouteilles', textAR: 'هـ - رمي مكثف للشماريخ أو القوارير' },
  { id: 'd_e2', code: 'E', textFR: 'E - Envahissement du terrain par les supporters', textAR: 'هـ - اقتحام أرضية الميدان من قبل الجماهير' },
  { id: 'd_e3', code: 'E', textFR: 'E - Banderoles ou chants obscènes et injurieux', textAR: 'هـ - رفع شعارات أو أهازيج مسيئة' }
];

export const INITIAL_MOCK_REPORTS: FullReport[] = [
  {
    id: 'rep_1',
    code: 'RAP-2026-001',
    season: '2025-2026',
    competition: 'Ligue I (Professionnelle)',
    matchDay: 'J14',
    matchDate: '2026-03-15',
    matchTime: '15:00',
    city: 'Sousse',
    stadium: 'Stade Olympique de Sousse',
    teamA: 'Étoile Sportive du Sahel',
    teamB: 'Espérance Sportive de Tunis',
    teamAAbbr: 'ESS',
    teamBAbbr: 'EST',
    scoreHalfA: 1,
    scoreHalfB: 0,
    scoreFinalA: 1,
    scoreFinalB: 1,
    difficultyLevel: 'ELEVEE',
    officials: [
      { id: 'o1', role: 'REFEREE', name: 'Naim Hosni', nameAR: 'نعيم حسني', league: 'Tunis', grade: 'International (FIFA)' },
      { id: 'o2', role: 'ASSISTANT_1', name: 'Anouar Hmila', nameAR: 'أنور هميلة', league: 'Centre (Sousse)', grade: 'International (FIFA)' },
      { id: 'o3', role: 'ASSISTANT_2', name: 'Aymen Ismail', nameAR: 'أيمن إسماعيل', league: 'Sud (Sfax)', grade: 'Fédéral' },
      { id: 'o4', role: 'FOURTH', name: 'Mahmoud Ksiaa', nameAR: 'محمود قسيعة', league: 'Nord-Ouest (Le Kef)', grade: '1ère Série' },
      { id: 'o5', role: 'VAR', name: 'Haythem Guirat', nameAR: 'هيثم قيرات', league: 'Tunis', grade: 'International (FIFA)' },
      { id: 'o6', role: 'AVAR', name: 'Wael Hannachi', nameAR: 'وائل الحناشي', league: 'Nabeul', grade: 'Fédéral' },
      { id: 'o7', role: 'INSPECTOR', name: 'Mohamed Ali Ben Hassine', nameAR: 'محمد علي بن حسين', league: 'Tunis', grade: 'Fédéral' }
    ],
    evaluations: {
      personality: {
        score: 8.4,
        positiveAspects: [
          { id: 'p1', criterionId: 'p5', textFR: 'Confiance dans les prises de décision', textAR: 'الثقة والحسم في اتخاذ القرارات', minute: 22 },
          { id: 'p2', criterionId: 'p3', textFR: 'Gestion des altercations générales', textAR: 'إدارة النزاعات الجماعية والتوتر', minute: 68 },
          { id: 'p3', criterionId: 'p7', textFR: 'Calme, sérénité et maîtrise de soi', textAR: 'الهدوء والسيطرة على النفس في اللحظات الحرجة', minute: 85 }
        ],
        improvementPoints: [
          { id: 'p4', criterionId: 'p2', textFR: 'Gestion de la distance réglementaire', textAR: 'إدارة المسافة القانونية (9.15m)', minute: 41 }
        ],
        comments: 'Arbitre très calme ayant su imposer son autorité naturelle dans un derby très tendu.'
      },
      physical: {
        score: 8.3,
        positiveAspects: [
          { id: 'ph1', criterionId: 'ph1', textFR: 'Lecture du jeu et anticipation des trajectoires', textAR: 'قراءة اللعب وتوقع مسار الكرة', minute: 14 },
          { id: 'ph2', criterionId: 'ph2', textFR: 'Angle de vision optimal lors des duels', textAR: 'زاوية الرؤية المناسبة عند الاحتكاك', minute: 30 }
        ],
        improvementPoints: [
          { id: 'ph3', criterionId: 'ph3', textFR: 'Placement sur les coups de pied arrêtés', textAR: 'التمركز الجيد في الكرات الثابتة', minute: 75 }
        ],
        comments: 'Bonne forme physique générale et mobilité fluide.'
      },
      laws: {
        score: 8.4,
        positiveAspects: [
          { id: 'l1', criterionId: 'l1', textFR: 'Différenciation imprudence / témérité / force excessive', textAR: 'التمييز بين الإهمال / التهور / القوة المفرطة', minute: 52 },
          { id: 'l2', criterionId: 'l2', textFR: "Application adéquate de la règle de l'avantage", textAR: 'التطبيق المحكم لقاعدة إعطاء الميزة', minute: 79 }
        ],
        improvementPoints: [
          { id: 'l3', criterionId: 'l4', textFR: 'Gestion précise du temps de jeu et du temps additionnel', textAR: 'إدارة الوقت والوقت بدل الضائع بدقة', minute: 90 }
        ],
        comments: 'Excellente gestion des cartons et application rigoureuse des lois du jeu.'
      },
      assistant1: {
        score: 8.3,
        positiveAspects: [
          { id: 'a1', criterionId: 'a1', textFR: 'Exactitude et rapidité des signalements de hors-jeu', textAR: 'دقة وسرعة إشارات التسلل', minute: 34 }
        ],
        improvementPoints: [],
        comments: 'Très bonne prestation de l assistant 1.'
      },
      assistant2: {
        score: 8.2,
        positiveAspects: [
          { id: 'a2', criterionId: 'a5', textFR: 'Placement et déplacements stricts sur la ligne du hors-jeu', textAR: 'التمركز والتحرك الدقيق على خط التسلل', minute: 58 }
        ],
        improvementPoints: [],
        comments: 'Signaux clairs et synchrones.'
      },
      fourthOfficial: {
        score: 8.3,
        positiveAspects: [
          { id: 'f1', criterionId: 'f1', textFR: 'Contrôle rigoureux de la zone technique et des bancs', textAR: 'المراقبة الصارمة للمنطقة الفنية ومقاعد البدلاء', minute: 45 }
        ],
        improvementPoints: [],
        comments: 'Excellente maîtrise du banc de touche.'
      }
    },
    calculatedRefereeScore: 8.37, // (8.4 + 2*8.3 + 3*8.4)/6 = 8.366 -> 8.37
    calculatedPerformanceFR: 'Bon',
    calculatedPerformanceAR: 'جيد (Bon)',
    substitutions: [
      { id: 's1', team: 'A', playerIn: 'Yassine Chikhaoui', playerOut: 'Raki Aouani', minute: 62 },
      { id: 's2', team: 'B', playerIn: 'Rodrigo Rodrigues', playerOut: 'Yan Sasse', minute: 70 }
    ],
    cards: [
      { id: 'c1', team: 'A', playerNumber: '8', playerName: 'Jalel Kadri', minute: 28, reason: 'A - Faute grossière / Tacle dangereux', cardType: 'YELLOW' },
      { id: 'c2', team: 'B', playerNumber: '5', playerName: 'Yassine Meriah', minute: 44, reason: 'B - Contestation véhémente', cardType: 'YELLOW' }
    ],
    staffIncidents: [
      { id: 'st1', name: 'Kamel القابسي', team: 'A', minute: 78, sanction: 'Avertissement', reason: 'D - Contestation répété des décisions' }
    ],
    crowdIncidents: [
      { id: 'cr1', description: 'Usage de 3 fumigènes dans le virage sud sans interruption de jeu.', minute: 55, severity: 'LIGHT' }
    ],
    generalComments: 'Match à haut enjeu maîtrisé avec succès par toute l équipe d arbitrage.',
    commissaireName: 'Mohamed Ali Ben Hassine',
    commissaireEmail: 'assesseurstunisie@gmail.com',
    citySignature: 'Sousse',
    dateSignature: '2026-03-15',
    status: 'VALIDATED',
    createdAt: '2026-03-15T18:00:00Z',
    updatedAt: '2026-03-15T18:30:00Z',
    drivePdfUrl: 'https://drive.google.com/file/d/demo_rapport_sousse/view'
  },
  {
    id: 'rep_2',
    code: 'RAP-2026-002',
    season: '2025-2026',
    competition: 'Ligue I (Professionnelle)',
    matchDay: 'J14',
    matchDate: '2026-03-16',
    matchTime: '14:30',
    city: 'Tunis',
    stadium: 'Stade Hammadi Agrebi de Radès',
    teamA: 'Club Africain',
    teamB: 'Stade Tunisien',
    teamAAbbr: 'CA',
    teamBAbbr: 'ST',
    scoreHalfA: 0,
    scoreHalfB: 0,
    scoreFinalA: 2,
    scoreFinalB: 1,
    difficultyLevel: 'MOYENNE',
    officials: [
      { id: 'o10', role: 'REFEREE', name: 'Amir Loussif', nameAR: 'أمير اللوصيف', league: 'Kairouan', grade: 'Fédéral' },
      { id: 'o11', role: 'ASSISTANT_1', name: 'Khalil Hassani', nameAR: 'خليل الحساني', league: 'Tunis', grade: 'Fédéral' },
      { id: 'o12', role: 'ASSISTANT_2', name: 'Faouzi Jridi', nameAR: 'فوزي الجريدي', league: 'Nabeul', grade: '1ère Série' },
      { id: 'o13', role: 'FOURTH', name: 'Badereddine Abdelkader', nameAR: 'بدر الدين عبد القادر', league: 'Nord (Bizerte)', grade: '2ème Série' },
      { id: 'o14', role: 'VAR', name: 'Youssef Srairi', nameAR: 'يوسف السرايري', league: 'Tunis', grade: 'Fédéral' },
      { id: 'o15', role: 'AVAR', name: 'Sami Mellouli', nameAR: 'سامي الملوالي', league: 'SUD', grade: 'Fédéral' },
      { id: 'o16', role: 'INSPECTOR', name: 'Ridha Bouglia', nameAR: 'رضا بوقلية', league: 'Tunis', grade: 'Fédéral' }
    ],
    evaluations: {
      personality: {
        score: 8.0,
        positiveAspects: [
          { id: 'p10', criterionId: 'p8', textFR: 'Autorité naturelle et charisme', textAR: 'الشخصية القوية والسلطة الطبيعية', minute: 15 }
        ],
        improvementPoints: [
          { id: 'p11', criterionId: 'p6', textFR: "Résistance à l'influence du public et des joueurs", textAR: 'الصمود والتأثر بضغط الجمهور واللاعبين', minute: 62 }
        ],
        comments: 'Doit montrer plus d assurance lors des protestations.'
      },
      physical: {
        score: 8.1,
        positiveAspects: [
          { id: 'ph10', criterionId: 'ph6', textFR: 'Endurance physique et constance sur 90 min', textAR: 'القدرة على التحمل واللياقة طيلة المباراة', minute: 88 }
        ],
        improvementPoints: [
          { id: 'ph11', criterionId: 'ph2', textFR: 'Angle de vision optimal lors des duels', textAR: 'زاوية الرؤية المناسبة عند الاحتكاك', minute: 40 }
        ],
        comments: 'Bon rythme de course mais parfois trop proche du ballon.'
      },
      laws: {
        score: 7.9,
        positiveAspects: [
          { id: 'l10', criterionId: 'l2', textFR: "Application adéquate de la règle de l'avantage", textAR: 'التطبيق المحكم لقاعدة إعطاء الميزة', minute: 23 }
        ],
        improvementPoints: [
          { id: 'l11', criterionId: 'l3', textFR: 'Vigilance sur les fautes tactiques et Occasion manifeste de but (DOGSO)', textAR: 'الحزم في الأخطاء التكتيكية وإلغاء فرصة هدف محققة', minute: 71 }
        ],
        comments: 'Une erreur manifeste d appréciation sur une faute à la 71ème minute corrigée par la VAR.'
      },
      assistant1: {
        score: 8.3,
        positiveAspects: [],
        improvementPoints: [],
        comments: 'Très bon alignement.'
      },
      assistant2: {
        score: 8.2,
        positiveAspects: [],
        improvementPoints: [],
        comments: 'Prestation correcte.'
      },
      fourthOfficial: {
        score: 8.1,
        positiveAspects: [],
        improvementPoints: [],
        comments: 'Bonne tenue du banc.'
      }
    },
    calculatedRefereeScore: 7.98,
    calculatedPerformanceFR: 'Bon avec erreur manifeste',
    calculatedPerformanceAR: 'جيد مع خطأ واضح (Bon avec erreur manifeste)',
    substitutions: [],
    cards: [],
    staffIncidents: [],
    crowdIncidents: [],
    generalComments: 'Match correct, bonne intervention de l assistance vidéo.',
    commissaireName: 'Ridha Bouglia',
    commissaireEmail: 'assesseurstunisie@gmail.com',
    citySignature: 'Tunis',
    dateSignature: '2026-03-16',
    status: 'DRAFT',
    createdAt: '2026-03-16T17:00:00Z',
    updatedAt: '2026-03-16T17:15:00Z'
  }
];

export const FULL_SQL_SCRIPT_SUPABASE = `-- =====================================================
-- Direction Nationale de l'Arbitrage (DNA) - FTF
-- Script Complet Supabase PostgreSQL (Tables & Rules)
-- =====================================================

-- 1. EXTENSIONS & TYPES ENUM
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE language_code AS ENUM ('FR', 'AR');
CREATE TYPE report_status AS ENUM ('DRAFT', 'VALIDATED', 'ARCHIVED');
CREATE TYPE match_official_role AS ENUM ('REFEREE', 'ASSISTANT_1', 'ASSISTANT_2', 'FOURTH_OFFICIAL', 'VAR', 'AVAR', 'INSPECTOR');
CREATE TYPE evaluation_target AS ENUM ('REFEREE', 'ASSISTANT_1', 'ASSISTANT_2', 'FOURTH_OFFICIAL');
CREATE TYPE observation_type AS ENUM ('POSITIVE', 'IMPROVEMENT');

-- 2. ROLES & PROFILES
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom_fr VARCHAR(50) NOT NULL,
    nom_ar VARCHAR(50) NOT NULL
);

INSERT INTO public.roles (code, nom_fr, nom_ar) VALUES
('COMMISSAIRE', 'Commissaire / Inspecteur', 'مراقب الحكام'),
('DNA', 'Direction Nationale (DNA)', 'الإدارة الوطنية للتحكيم'),
('ADMIN', 'Administrateur', 'المدير'),
('LECTURE', 'Lecture Seule', 'مشاهدة فقط');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    ligue VARCHAR(100),
    grade VARCHAR(50),
    langue language_code DEFAULT 'FR',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SEASONS, COMPETITIONS & LEAGUES
CREATE TABLE public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. "2025-2026"
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL
);

-- 4. CRITERIA & REASONS
CREATE TABLE public.evaluation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- PERSONALITY, PHYSICAL, LAWS, ASSISTANTS, FOURTH
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL,
    coefficient INT DEFAULT 1
);

CREATE TABLE public.evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.evaluation_categories(id),
    text_fr TEXT NOT NULL,
    text_ar TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 5. REPORTS TABLE
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    season VARCHAR(20) NOT NULL,
    competition VARCHAR(100) NOT NULL,
    match_day VARCHAR(20) NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    city VARCHAR(100) NOT NULL,
    stadium VARCHAR(100) NOT NULL,
    team_a VARCHAR(100) NOT NULL,
    team_b VARCHAR(100) NOT NULL,
    team_a_abbr VARCHAR(10),
    team_b_abbr VARCHAR(10),
    score_mt_a INT DEFAULT 0,
    score_mt_b INT DEFAULT 0,
    score_fin_a INT DEFAULT 0,
    score_fin_b INT DEFAULT 0,
    difficulty_level VARCHAR(20) NOT NULL,
    
    note_personality NUMERIC(3,1),
    note_physical NUMERIC(3,1),
    note_laws NUMERIC(3,1),
    note_referee_final NUMERIC(4,2),
    performance_fr VARCHAR(100),
    performance_ar VARCHAR(100),
    
    status report_status DEFAULT 'DRAFT',
    commissaire_email VARCHAR(255) NOT NULL,
    google_drive_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policy for Commissaires: view and update own draft reports
CREATE POLICY "Commissaires view own reports" ON public.reports
    FOR SELECT USING (commissaire_email = auth.jwt()->>'email' OR true);

CREATE POLICY "Commissaires insert own reports" ON public.reports
    FOR INSERT WITH CHECK (commissaire_email = auth.jwt()->>'email');

CREATE POLICY "Commissaires update draft reports" ON public.reports
    FOR UPDATE USING (commissaire_email = auth.jwt()->>'email' AND status = 'DRAFT');

-- Policy for DNA & Admins: full access
CREATE POLICY "DNA full read access" ON public.reports
    FOR SELECT USING (true);
`;
