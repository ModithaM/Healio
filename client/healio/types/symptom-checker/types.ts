export type UrgencyLevel = "ROUTINE" | "SOON" | "URGENT" | "EMERGENCY";

export interface SymptomAnalysisRequest {
  userId: string;
  symptoms: string;
  additionalInfo?: string;
  patientAge?: number;
  patientGender?: string;
}

export interface SymptomAnalysisResponse {
  checkId: string;
  userId: string;
  symptoms: string;
  possibleConditions: string[];
  urgencyLevel: UrgencyLevel;
  recommendedSpecialties: string[];
  generalAdvice: string;
  disclaimer: string;
  analyzedAt: string;
}

export interface SymptomCheckHistoryItem {
  id: string;
  userId: string;
  symptoms: string;
  additionalInfo?: string;
  urgencyLevel: UrgencyLevel;
  createdAt: string;
}
