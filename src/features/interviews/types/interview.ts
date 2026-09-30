export type InterviewRoundType =
  | "recruiter_screen"
  | "phone_screen"
  | "technical"
  | "system_design"
  | "behavioral"
  | "portfolio_review"
  | "hiring_manager"
  | "onsite"
  | "final"
  | "other";

export type InterviewOutcome = "pending" | "passed" | "failed" | "cancelled";

export interface InterviewRound {
  id: string;
  applicationId: string;
  roundType: InterviewRoundType;
  scheduledDate: string;
  interviewerName: string | null;
  interviewerRole: string | null;
  outcome: InterviewOutcome;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// roundType and scheduledDate are required on create. outcome defaults to "pending". */
export interface CreateInterviewRoundInput {
  roundType: InterviewRoundType;
  scheduledDate: string;
  interviewerName?: string | null;
  interviewerRole?: string | null;
  notes?: string | null;
}
