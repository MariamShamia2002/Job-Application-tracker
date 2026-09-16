import type { InterviewOutcome, InterviewRoundType } from "@/api/types";

export const INTERVIEW_ROUND_OPTIONS: InterviewRoundType[] = [
  "recruiter_screen",
  "phone_screen",
  "technical",
  "system_design",
  "behavioral",
  "portfolio_review",
  "hiring_manager",
  "onsite",
  "final",
  "other",
];

export const INTERVIEW_ROUND_LABELS: Record<InterviewRoundType, string> = {
  recruiter_screen: "Recruiter screen",
  phone_screen: "Phone screen",
  technical: "Technical interview",
  system_design: "System design",
  behavioral: "Behavioral",
  portfolio_review: "Portfolio review",
  hiring_manager: "Hiring manager",
  onsite: "Onsite loop",
  final: "Final",
  other: "Other",
};

export const INTERVIEW_OUTCOME_LABELS: Record<InterviewOutcome, string> = {
  pending: "Scheduled",
  passed: "Passed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const INTERVIEW_OUTCOME_CLASS: Record<InterviewOutcome, string> = {
  pending: "border border-blue-200 bg-blue-50 text-blue-600",
  passed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border border-red-200 bg-red-50 text-red-700",
  cancelled: "border border-zinc-200 bg-zinc-100 text-zinc-600",
};
