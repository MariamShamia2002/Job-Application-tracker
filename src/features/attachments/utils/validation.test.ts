import { describe, expect, it } from "vitest";
import { ATTACHMENT_MAX_BYTES, formatFileSize, validateAttachment } from "./validation";

const PDF_TYPE = "application/pdf";
const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// Overrides `size` so tests can check large files without allocating megabytes.
function makeFile(name: string, type = "", size = 1024) {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("validateAttachment", () => {
  it("accepts a small PDF", () => {
    const file = makeFile("resume.pdf", PDF_TYPE);

    expect(validateAttachment(file)).toBeUndefined();
  });

  // ...
});

describe("formatFileSize", () => {
  it.each([
    [500, "500 B"],
    [2048, "2.0 KB"],
    [3 * 1024 * 1024, "3.0 MB"],
  ])("formats %i bytes as %s", (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe("validateAttachment: more cases", () => {
  it("returns nothing when there is no file", () => {
    expect(validateAttachment(null)).toBeUndefined();
  });

  it.each([
    ["a DOCX by name and type", makeFile("resume.docx", DOCX_TYPE)],
    ["a PDF by file name only", makeFile("resume.pdf")],
    ["a DOCX by file name only", makeFile("resume.docx")],
    ["an upper-case file name", makeFile("RESUME.PDF")],
    ["a PDF by file type only", makeFile("resume", PDF_TYPE)],
    ["a DOCX by file type only", makeFile("resume", DOCX_TYPE)],
  ])("accepts %s", (_label, file) => {
    expect(validateAttachment(file)).toBeUndefined();
  });

  it("accepts a file of exactly 5 MB", () => {
    const file = makeFile("resume.pdf", PDF_TYPE, ATTACHMENT_MAX_BYTES);
    expect(validateAttachment(file)).toBeUndefined();
  });

  it.each([
    ["a PNG image", makeFile("photo.png", "image/png")],
    ["an old .doc file", makeFile("resume.doc", "application/msword")],
    ["a text file", makeFile("notes.txt", "text/plain")],
    ["a file with no extension or type", makeFile("resume")],
  ])("rejects %s", (_label, file) => {
    expect(validateAttachment(file)).toBe("Must be a PDF or DOCX file");
  });

  it("rejects a file over 5 MB", () => {
    const file = makeFile("resume.pdf", PDF_TYPE, ATTACHMENT_MAX_BYTES + 1);
    expect(validateAttachment(file)).toBe("Must be 5MB or smaller");
  });
});

describe("formatFileSize: more cases", () => {
  it.each([
    [0, "0 B"],
    [1023, "1023 B"],
    [1024, "1.0 KB"],
    [1536, "1.5 KB"],
    [1024 * 1024, "1.0 MB"],
    [2.5 * 1024 * 1024, "2.5 MB"],
  ])("formats %i bytes as %s", (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});
