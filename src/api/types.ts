// Enums 
export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary";

export type WorkMode = "remote" | "hybrid" | "onsite";

//Declared in workflow order — this is also the sort order used by ?sort=status.
export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone_screen"
  | "technical_interview"
  | "onsite_interview"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "ghosted";

export type ApplicationSource =
  | "linkedin"
  | "referral"
  | "company_site"
  | "job_board"
  | "recruiter"
  | "other";

export type Priority = "low" | "medium" | "high";

export type SeniorityLevel =
  | "intern"
  | "entry"
  | "mid"
  | "senior"
  | "lead"
  | "staff"
  | "principal";

export type SalaryCurrency = "USD" | "EUR" | "GBP" | "CAD" | "other";

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

//  Auth 
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Application 
// Lightweight next-round summary embedded in every Application response.
// It is the soonest round with outcome === "pending", or null.
export interface NextRound {
  id: string;
  roundType: InterviewRoundType;
  scheduledDate: string;
  interviewerName: string | null;
}

// Full Application object — shape is identical for list rows and single fetches.
export interface Application {
  id: string;
  userId: string;

  // Core
  company: string;
  companyWebsite: string | null;
  role: string;
  department: string | null;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string | null;
  seniorityLevel: SeniorityLevel | null;
  jobPostingUrl: string | null;
  jobDescription: string | null;

  // Status & dates
  status: ApplicationStatus;
  appliedDate: string | null;
  deadlineDate: string | null;

  // Source
  source: ApplicationSource | null;
  referralName: string | null;

  recruiterName: string | null;
  recruiterTitle: string | null;
  recruiterEmail: string | null;
  recruiterPhone: string | null;

  // Priority & compensation
  priority: Priority;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: SalaryCurrency;
  equityOffered: boolean;

  // Offer
  offerDeadline: string | null;

  // Contacts & metadata
  contactEmail: string | null;
  tags: string[];
  notes: string | null;
  rejectionReason: string | null;

  // Attachments
  hasResume: boolean;
  resumeFileName: string | null;
  hasCoverLetter: boolean;
  coverLetterFileName: string | null;

  // Misc
  archived: boolean;

  // Computed — soonest pending interview round, null if none
  nextRound: NextRound | null;

  createdAt: string;
  updatedAt: string;
}

//Application mutations 

//Required: company, role, employmentType, workMode.
//Server defaults: status="saved", priority="medium", salaryCurrency="USD",
// equityOffered=false, archived=false.
 
export interface CreateApplicationInput {
  // Required
  company: string;
  role: string;
  employmentType: EmploymentType;
  workMode: WorkMode;

  // Optional
  companyWebsite?: string | null;
  department?: string | null;
  location?: string | null;
  seniorityLevel?: SeniorityLevel | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;

  status?: ApplicationStatus;
  appliedDate?: string | null;
  deadlineDate?: string | null;

  source?: ApplicationSource | null;
  referralName?: string | null;

  recruiterName?: string | null;
  recruiterTitle?: string | null;
  recruiterEmail?: string | null;
  recruiterPhone?: string | null;

  priority?: Priority;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: SalaryCurrency;
  equityOffered?: boolean;

  offerDeadline?: string | null;

  contactEmail?: string | null;
  tags?: string[];
  notes?: string | null;
  rejectionReason?: string | null;

  archived?: boolean;
}

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export interface UpdateStatusInput {
  status: ApplicationStatus;
}

//List / filter 

export interface ApplicationsFilters {
  search?: string;
  status?: ApplicationStatus;
  source?: ApplicationSource;
  priority?: Priority;
  // Defaults to false — archived rows are hidden unless explicitly requested. */
  archived?: boolean;
  // Format: "<field>:<asc|desc>". Valid fields: createdAt appliedDate deadlineDate company priority status */
  sort?: string;
}

export interface ApplicationsResponse {
  data: Application[];
  meta: { count: number };
}

// Interview rounds
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

//Errors 

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR";

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  //Present only on VALIDATION_ERROR. Keys are field names; values are display-ready strings. */
  fields?: Record<string, string>;
}

export interface ApiError {
  status: number;
  error: ApiErrorBody;
}