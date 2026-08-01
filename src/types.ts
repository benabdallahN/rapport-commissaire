import { DnaEvaluationAxis } from './data/dnaAxesData';
export type { DnaEvaluationAxis };

export type Language = 'FR' | 'AR';

export type UserRole = 'COMMISSAIRE' | 'DNA' | 'ADMIN' | 'LECTURE';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  league: string;
  grade: string;
  avatarUrl?: string;
}

export type ReportStatus = 'DRAFT' | 'VALIDATED' | 'ARCHIVED';

export type OfficialRole =
  | 'REFEREE'
  | 'ASSISTANT_1'
  | 'ASSISTANT_2'
  | 'FOURTH'
  | 'VAR'
  | 'AVAR'
  | 'INSPECTOR';

export interface MatchOfficial {
  id: string;
  role: OfficialRole;
  name: string;
  nameAR?: string;
  league: string;
  grade: string;
  difficultyLevel?: 'FACILE' | 'MOYENNE' | 'ELEVEE';
}

export interface EvaluationObservation {
  id: string;
  criterionId: string;
  textFR: string;
  textAR: string;
  minute?: number;
}

export interface CategoryEvaluation {
  score: number; // 6.0 to 10.0
  positiveAspects: EvaluationObservation[]; // Max 3
  improvementPoints: EvaluationObservation[]; // Max 3
  comments: string;
}

export interface SubstitutionEvent {
  id: string;
  team: 'A' | 'B';
  playerIn: string;
  playerOut: string;
  minute: number;
}

export interface CardEvent {
  id: string;
  team: 'A' | 'B';
  playerNumber: string;
  playerName?: string;
  minute: number;
  reason: string;
  cardType: 'YELLOW' | 'SECOND_YELLOW' | 'RED';
}

export interface StaffIncidentEvent {
  id: string;
  name: string;
  team: 'A' | 'B';
  minute: number;
  sanction: string;
  reason: string;
}

export interface CrowdIncidentEvent {
  id: string;
  description: string;
  minute?: number;
  severity: 'LIGHT' | 'MODERATE' | 'SEVERE';
}

export interface PracticalExamInfo {
  isExam: boolean;
  examLevel: string; // e.g., 'Examen Fédéral', 'Examen 1ère Série', 'Examen 2ème Série'
}

export interface PracticalExamsConfig {
  referee?: PracticalExamInfo;
  assistant1?: PracticalExamInfo;
  assistant2?: PracticalExamInfo;
  fourthOfficial?: PracticalExamInfo;
}

export interface FullReport {
  id: string;
  code: string; // e.g. "RAP-2026-001"
  season: string; // "2025-2026"
  competition: string; // "Ligue I"
  matchDay: string; // e.g. "J14" or "14"
  matchDate: string; // "YYYY-MM-DD"
  matchTime: string; // "HH:MM"
  city: string;
  stadium: string;
  
  teamA: string;
  teamB: string;
  teamAAbbr: string;
  teamBAbbr: string;
  
  scoreHalfA: number;
  scoreHalfB: number;
  scoreFinalA: number;
  scoreFinalB: number;
  
  difficultyLevel: 'ELEVEE' | 'MOYENNE' | 'FACILE';
  
  officials: MatchOfficial[];
  
  evaluations: {
    personality: CategoryEvaluation;
    physical: CategoryEvaluation;
    laws: CategoryEvaluation;
    assistant1: CategoryEvaluation;
    assistant2: CategoryEvaluation;
    fourthOfficial: CategoryEvaluation;
    [customAxisId: string]: CategoryEvaluation;
  };
  
  axesSnapshot?: DnaEvaluationAxis[]; // Preserves exact axes & coefficients used at report creation
  
  calculatedRefereeScore: number; // weighted according to active DNA axes
  calculatedPerformanceFR: string;
  calculatedPerformanceAR: string;
  
  substitutions: SubstitutionEvent[];
  cards: CardEvent[];
  staffIncidents: StaffIncidentEvent[];
  crowdIncidents: CrowdIncidentEvent[];
  
  generalComments: string;
  commissaireName: string;
  commissaireEmail: string;

  // Supervision conjoint / 2 commissaires
  isJointEvaluation?: boolean;
  secondCommissaireName?: string;
  secondCommissaireEmail?: string;

  // Examens pratiques
  practicalExams?: PracticalExamsConfig;

  citySignature: string;
  dateSignature: string;
  signatureDataUrl?: string;
  
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  drivePdfUrl?: string;
}

export interface CriterionItem {
  id: string;
  categoryId: 'PERSONALITY' | 'PHYSICAL' | 'LAWS' | 'ASSISTANTS' | 'FOURTH';
  textFR: string;
  textAR: string;
}

export interface DisciplinaryReasonItem {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  textFR: string;
  textAR: string;
}
