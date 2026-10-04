import { describe, expect, it } from "vitest";
import type { ApplicationFormValues } from "../types/applicationForm";
import { EMPTY_FORM_VALUES } from "./formDefaults";
import { validateForm } from "./formValidation";

// A form that passes every rule. Each test changes only what it needs.
const validForm: ApplicationFormValues = {
  ...EMPTY_FORM_VALUES,
  company: "Acme",
  role: "Frontend Engineer",
  location: "Cairo",
};

describe("validateForm", () => {
  it("returns no errors for a valid form", () => {
    expect(validateForm(validForm)).toEqual({});
  });

  it("requires company and role", () => {
    const errors = validateForm({ ...validForm, company: "", role: "  " });
    expect(errors.company).toBeDefined();
    expect(errors.role).toBeDefined();
  });

  it("does not require a location for remote jobs", () => {
    const errors = validateForm({ ...validForm, workMode: "remote", location: "" });
    expect(errors.location).toBeUndefined();
  });

  it("requires a referral name when the source is a referral", () => {
    const errors = validateForm({ ...validForm, source: "referral" });
    expect(errors.referralName).toBeDefined();
  });

  it("rejects a minimum salary above the maximum", () => {
    const errors = validateForm({ ...validForm, salaryMin: "9000", salaryMax: "5000" });
    expect(errors.salaryMin).toBeDefined();
  });
});

const PAST_DATE = "2020-01-15";
const FUTURE_DATE = "2999-01-15";

describe("validateForm: more cases", () => {
  describe("company and role", () => {
    it("treats spaces only as empty", () => {
      const errors = validateForm({ ...validForm, company: "   ", role: "  " });
      expect(errors.company).toBeDefined();
      expect(errors.role).toBeDefined();
    });
  });

  describe("company website", () => {
    it("is optional", () => {
      expect(validateForm({ ...validForm, companyWebsite: "" }).companyWebsite).toBeUndefined();
    });

    it.each(["https://acme.com", "http://acme.com", "acme.com"])(
      "accepts %s",
      (companyWebsite) => {
        expect(validateForm({ ...validForm, companyWebsite }).companyWebsite).toBeUndefined();
      },
    );

    it("rejects a value that is not a URL", () => {
      const errors = validateForm({ ...validForm, companyWebsite: "not a url" });
      expect(errors.companyWebsite).toBeDefined();
    });
  });

  describe("location", () => {
    it.each(["hybrid", "onsite"] as const)("is required when work mode is %s", (workMode) => {
      const errors = validateForm({ ...validForm, workMode, location: "" });
      expect(errors.location).toBeDefined();
    });
  });

  describe("applied date", () => {
    it("is not required when status is saved", () => {
      const errors = validateForm({ ...validForm, status: "saved", appliedDate: "" });
      expect(errors.appliedDate).toBeUndefined();
    });

    it("is required when status is not saved", () => {
      const errors = validateForm({ ...validForm, status: "applied", appliedDate: "" });
      expect(errors.appliedDate).toBeDefined();
    });

    it("accepts a date in the past", () => {
      const errors = validateForm({ ...validForm, status: "applied", appliedDate: PAST_DATE });
      expect(errors.appliedDate).toBeUndefined();
    });

    it("cannot be in the future", () => {
      const errors = validateForm({ ...validForm, status: "applied", appliedDate: FUTURE_DATE });
      expect(errors.appliedDate).toBe("Applied date cannot be in the future");
    });
  });

  describe("referral name", () => {
    it("Referral name is required when source is referral", () => {
      const errors = validateForm({ ...validForm, source: "referral", referralName: "" });
      expect(errors.referralName).toBeDefined();
    });

    it("is not required for other sources", () => {
      const errors = validateForm({ ...validForm, source: "linkedin" });
      expect(errors.referralName).toBeUndefined();
    });
  });

  describe("recruiter email", () => {
    it("is optional", () => {
      expect(validateForm({ ...validForm, recruiterEmail: "" }).recruiterEmail).toBeUndefined();
    });

    it("accepts a valid email", () => {
      const errors = validateForm({ ...validForm, recruiterEmail: "sara@acme.com" });
      expect(errors.recruiterEmail).toBeUndefined();
    });


    it.each(["sara", "sara@acme", "sara acme.com"])("rejects %s", (recruiterEmail) => {
      const errors = validateForm({ ...validForm, recruiterEmail });
      expect(errors.recruiterEmail).toBeDefined();
    });
  });

  describe("salary", () => {
    it("must be a number", () => {
      const errors = validateForm({ ...validForm, salaryMin: "abc", salaryMax: "lots" });
      expect(errors.salaryMin).toBeDefined();
      expect(errors.salaryMax).toBeDefined();
    });

    it("min cannot be greater than max", () => {
      const errors = validateForm({ ...validForm, salaryMin: "5000", salaryMax: "3000" });
      expect(errors.salaryMin).toBeDefined();
    });
  });

  describe("when a step is passed", () => {
    // Breaks one rule on step 1 (company), step 2 (recruiterEmail) and step 3 (salaryMin).
    const invalidForm: ApplicationFormValues = {
      ...validForm,
      company: "",
      recruiterEmail: "not-an-email",
      salaryMin: "abc",
    };

    it("returns errors from every step without a step", () => {
      expect(Object.keys(validateForm(invalidForm)).sort()).toEqual([
        "company",
        "recruiterEmail",
        "salaryMin",
      ]);
    });

    it.each([
      [1, "company"],
      [2, "recruiterEmail"],
      [3, "salaryMin"],
    ] as const)("step %i only returns %s", (step, field) => {
      expect(Object.keys(validateForm(invalidForm, step))).toEqual([field]);
    });

    it("returns no errors for a step whose fields are all valid", () => {
      expect(validateForm(invalidForm, 4)).toEqual({});
    });
  });
});
