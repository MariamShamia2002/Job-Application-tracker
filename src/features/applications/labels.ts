import type {
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  InterviewOutcome,
  InterviewRoundType,
  Priority,
  SalaryCurrency,
  SeniorityLevel,
  WorkMode,
} from "@/api/types";

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone_screen",
  "technical_interview",
  "onsite_interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
  "ghosted",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  phone_screen: "Phone screen",
  technical_interview: "Technical",
  onsite_interview: "Onsite",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  ghosted: "Ghosted",
};

export const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  saved: "bg-zinc-200 text-zinc-600",
  applied: "bg-[#3b82f6] text-white",
  phone_screen: "bg-[#22d3ee] text-white",
  technical_interview: "bg-[#a855f7] text-white",
  onsite_interview: "bg-[#f59e0b] text-white",
  offer: "bg-[#22c55e] text-white",
  accepted: "bg-[#16a34a] text-white",
  rejected: "bg-[#ef4444] text-white",
  withdrawn: "bg-zinc-200 text-zinc-500",
  ghosted: "bg-zinc-500 text-white",
};

export const SOURCE_OPTIONS: ApplicationSource[] = [
  "linkedin",
  "referral",
  "company_site",
  "job_board",
  "recruiter",
  "other",
];

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  linkedin: "LinkedIn",
  referral: "Referral",
  company_site: "Company site",
  job_board: "Job board",
  recruiter: "Recruiter outreach",
  other: "Other",
};

export const PRIORITY_OPTIONS: Priority[] = ["high", "medium", "low"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const PRIORITY_DOT_CLASS: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-zinc-400",
};

export const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "temporary",
];

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};

export const WORK_MODE_OPTIONS: WorkMode[] = ["remote", "hybrid", "onsite"];

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export const SENIORITY_OPTIONS: SeniorityLevel[] = [
  "intern",
  "entry",
  "mid",
  "senior",
  "lead",
  "staff",
  "principal",
];

export const SENIORITY_LABELS: Record<SeniorityLevel, string> = {
  intern: "Intern",
  entry: "Entry",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  staff: "Staff",
  principal: "Principal",
};

export const CURRENCY_OPTIONS: SalaryCurrency[] = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "other",
];

export const CURRENCY_LABELS: Record<SalaryCurrency, string> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  CAD: "CAD",
  other: "Other",
};

export const PRIORITY_HINTS: Record<Priority, string> = {
  high: "chase it",
  medium: "keep warm",
  low: "backup",
};

export const SUGGESTED_TAGS = [
  "design systems",
  "remote-first",
  "series B",
  "equity heavy",
  "fast process",
  "referral",
];

export function formatAppliedDate(iso: string | null) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

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
