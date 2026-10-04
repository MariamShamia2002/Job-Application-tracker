import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import { toFormValues } from "./toFormValues";

const application: Application = {
  id: "app-1",
  userId: "user-1",
  company: "Acme",
  companyWebsite: null,
  role: "Frontend Engineer",
  department: null,
  employmentType: "full_time",
  workMode: "hybrid",
  location: null,
  seniorityLevel: null,
  jobPostingUrl: null,
  jobDescription: null,
  status: "applied",
  appliedDate: "2026-03-10T00:00:00.000Z",
  deadlineDate: "2026-04-01T12:30:00.000Z",
  source: null,
  referralName: null,
  recruiterName: null,
  recruiterTitle: null,
  recruiterEmail: null,
  recruiterPhone: null,
  priority: "medium",
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: "USD",
  equityOffered: false,
  offerDeadline: null,
  contactEmail: null,
  tags: [],
  notes: null,
  rejectionReason: null,
  hasResume: false,
  resumeFileName: null,
  hasCoverLetter: false,
  coverLetterFileName: null,
  archived: false,
  nextRound: null,
  createdAt: "2026-03-10T00:00:00.000Z",
  updatedAt: "2026-03-10T00:00:00.000Z",
};

describe("toFormValues", () => {
  it("turns null text fields into empty strings", () => {
    const values = toFormValues(application);

    expect(values).toMatchObject({
      companyWebsite: "",
      department: "",
      location: "",
      seniorityLevel: "",
      source: "",
      referralName: "",
      recruiterName: "",
      recruiterEmail: "",
      jobDescription: "",
      notes: "",
    });
  });

  it("turns null salaries into empty strings and numbers into strings", () => {
    expect(toFormValues(application)).toMatchObject({ salaryMin: "", salaryMax: "" });
    expect(
      toFormValues({ ...application, salaryMin: 0, salaryMax: 90000 }),
    ).toMatchObject({ salaryMin: "0", salaryMax: "90000" });
  });

  it("cuts dates to YYYY-MM-DD", () => {
    const values = toFormValues(application);

    expect(values.appliedDate).toBe("2026-03-10");
    expect(values.deadlineDate).toBe("2026-04-01");
  });

  it("turns null dates into empty strings", () => {
    const values = toFormValues({ ...application, appliedDate: null, deadlineDate: null });

    expect(values.appliedDate).toBe("");
    expect(values.deadlineDate).toBe("");
  });

  it("starts with no files selected", () => {
    const values = toFormValues({ ...application, hasResume: true, resumeFileName: "cv.pdf" });

    expect(values.resumeFile).toBeNull();
    expect(values.coverLetterFile).toBeNull();
  });
});
