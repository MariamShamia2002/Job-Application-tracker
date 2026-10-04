import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import type { ApplicationFormValues } from "../types/applicationForm";
import { EMPTY_FORM_VALUES } from "./formDefaults";
import { toCreateInput } from "./toCreateInput";
import { toFormValues } from "./toFormValues";
import { toUpdateInput } from "./toUpdateInput";

const values: ApplicationFormValues = {
  ...EMPTY_FORM_VALUES,
  company: "Acme",
  role: "Frontend Engineer",
  location: "Cairo",
};

describe("toCreateInput", () => {
  describe("text fields", () => {
    it("trims text", () => {
      const input = toCreateInput({
        ...values,
        company: "  Acme  ",
        role: " Frontend Engineer ",
        department: "  Platform ",
        notes: "\n Great team \n",
      });

      expect(input.company).toBe("Acme");
      expect(input.role).toBe("Frontend Engineer");
      expect(input.department).toBe("Platform");
      expect(input.notes).toBe("Great team");
    });

    it.each([
      "department",
      "referralName",
      "recruiterName",
      "recruiterEmail",
      "jobDescription",
      "notes",
      "appliedDate",
      "deadlineDate",
    ] as const)("turns empty or spaces-only %s into undefined", (field) => {
      expect(toCreateInput({ ...values, [field]: "" })[field]).toBeUndefined();
      expect(toCreateInput({ ...values, [field]: "   " })[field]).toBeUndefined();
    });

    it("turns empty select fields into undefined", () => {
      const input = toCreateInput({ ...values, seniorityLevel: "", source: "" });

      expect(input.seniorityLevel).toBeUndefined();
      expect(input.source).toBeUndefined();
    });

    it("adds https:// to a website without a protocol", () => {
      expect(toCreateInput({ ...values, companyWebsite: "acme.com" }).companyWebsite).toBe(
        "https://acme.com",
      );
    });

    it("turns an empty website into undefined", () => {
      expect(toCreateInput({ ...values, companyWebsite: "  " }).companyWebsite).toBeUndefined();
    });
  });

  describe("salary", () => {
    it("turns salary strings into numbers", () => {
      const input = toCreateInput({ ...values, salaryMin: "50000", salaryMax: " 90000 " });

      expect(input.salaryMin).toBe(50000);
      expect(input.salaryMax).toBe(90000);
    });

    it("keeps a salary of 0", () => {
      expect(toCreateInput({ ...values, salaryMin: "0" }).salaryMin).toBe(0);
    });

    it("leaves out an empty salary", () => {
      const input = toCreateInput({ ...values, salaryMin: "", salaryMax: "  " });

      expect(input.salaryMin).toBeUndefined();
      expect(input.salaryMax).toBeUndefined();
      expect(JSON.parse(JSON.stringify(input))).not.toHaveProperty("salaryMin");
    });

    it("leaves out a salary that is not a number", () => {
      expect(toCreateInput({ ...values, salaryMin: "abc" }).salaryMin).toBeUndefined();
    });
  });

  describe("location", () => {
    it("is dropped when work mode is remote", () => {
      const input = toCreateInput({ ...values, workMode: "remote", location: "Cairo" });
      expect(input.location).toBeUndefined();
    });

    it.each(["hybrid", "onsite"] as const)("is kept when work mode is %s", (workMode) => {
      expect(toCreateInput({ ...values, workMode }).location).toBe("Cairo");
    });
  });
});

describe("round trip: toFormValues then toCreateInput", () => {
  const application: Application = {
    id: "app-1",
    userId: "user-1",
    company: "Acme",
    companyWebsite: "https://acme.com",
    role: "Frontend Engineer",
    department: "Platform",
    employmentType: "contract",
    workMode: "hybrid",
    location: "Cairo",
    seniorityLevel: "senior",
    jobPostingUrl: null,
    jobDescription: "Build the dashboard",
    status: "applied",
    appliedDate: "2026-03-10",
    deadlineDate: "2026-04-01",
    source: "referral",
    referralName: "Sara",
    recruiterName: "Omar",
    recruiterTitle: null,
    recruiterEmail: "omar@acme.com",
    recruiterPhone: null,
    priority: "high",
    salaryMin: 50000,
    salaryMax: 90000,
    salaryCurrency: "EUR",
    equityOffered: true,
    offerDeadline: null,
    contactEmail: null,
    tags: ["react", "remote-friendly"],
    notes: "Great team",
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

  it("keeps the original values", () => {
    expect(toCreateInput(toFormValues(application))).toEqual({
      company: application.company,
      companyWebsite: application.companyWebsite,
      role: application.role,
      department: application.department,
      employmentType: application.employmentType,
      workMode: application.workMode,
      location: application.location,
      seniorityLevel: application.seniorityLevel,
      jobDescription: application.jobDescription,
      status: application.status,
      appliedDate: application.appliedDate,
      deadlineDate: application.deadlineDate,
      source: application.source,
      referralName: application.referralName,
      recruiterName: application.recruiterName,
      recruiterEmail: application.recruiterEmail,
      priority: application.priority,
      salaryMin: application.salaryMin,
      salaryMax: application.salaryMax,
      salaryCurrency: application.salaryCurrency,
      equityOffered: application.equityOffered,
      tags: application.tags,
      notes: application.notes,
    });
  });
});

// Regression test: editing used to send toCreateInput(values), which turned a
// cleared field into undefined. JSON.stringify drops undefined keys, so the
// server kept the old value. A cleared field must be sent as null.
const editPayload = (formValues: ApplicationFormValues) => toUpdateInput(formValues);

describe("editing an application", () => {
  it("sends a field the user cleared as null so the server clears it", () => {
    const saved = toFormValues({
      ...({} as Application),
      company: "Acme",
      role: "Frontend Engineer",
      employmentType: "full_time",
      workMode: "hybrid",
      status: "applied",
      priority: "medium",
      salaryCurrency: "USD",
      equityOffered: false,
      location: "Cairo",
      department: "Platform",
      notes: "Old note",
      recruiterEmail: "omar@acme.com",
      salaryMin: 50000,
    });

    const cleared = {
      ...saved,
      department: "",
      notes: "",
      recruiterEmail: "",
      salaryMin: "",
    };

    const body = JSON.parse(JSON.stringify(editPayload(cleared)));

    expect(body).toHaveProperty("department", null);
    expect(body).toHaveProperty("notes", null);
    expect(body).toHaveProperty("recruiterEmail", null);
    expect(body).toHaveProperty("salaryMin", null);
  });

  it("still sends the fields the user did not clear", () => {
    const body = JSON.parse(
      JSON.stringify(editPayload({ ...values, notes: "New note", salaryMax: "90000" })),
    );

    expect(body).toMatchObject({
      company: "Acme",
      location: "Cairo",
      notes: "New note",
      salaryMax: 90000,
    });
  });
});
