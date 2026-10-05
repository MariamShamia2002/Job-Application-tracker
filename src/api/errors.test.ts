import { describe, expect, it } from "vitest";
import { statusToCode } from "./client";
import { getErrorMessage, getFieldErrors, isUnauthorized } from "./errors";
import { isErrorEnvelope } from "./client";
import { isConflict, isInternalError, isNotFound, isServiceUnavailable, isValidationError } from "./errors";
import type { ApiErrorCode } from "./types";
describe("API error helpers", () => {
	it("detects a 401 error", () => {
		const error = { status: 401, error: { code: "UNAUTHORIZED", message: "No" } };
		expect(isUnauthorized(error)).toBe(true);
	});
	it("reads field errors from a validation error", () => {
		const error = {
			status: 400,
			error: { code: "VALIDATION_ERROR", message: "Bad", fields: { role: "Required" } },
		};
		expect(getFieldErrors(error)).toEqual({ role: "Required" });
	});
	it("falls back to a default message for unknown errors", () => {
		expect(getErrorMessage(new Error("boom"), "Try again")).toBe("Try again");
	});
});

describe("statusToCode", () => {
	it.each([
		[400, "VALIDATION_ERROR"],
		[401, "UNAUTHORIZED"],
		[404, "NOT_FOUND"],
		[409, "CONFLICT"],
		[500, "INTERNAL_ERROR"],
		[503, "SERVICE_UNAVAILABLE"],
	])("maps %i to %s", (status, code) => {
		expect(statusToCode(status)).toBe(code);
	});

	it.each([403, 422, 502])("falls back to UNKNOWN_ERROR for %i", (status) => {
		expect(statusToCode(status)).toBe("UNKNOWN_ERROR");
	});
});

describe("isErrorEnvelope", () => {
	it("accepts { error: { code } }", () => {
		expect(isErrorEnvelope({ error: { code: "NOT_FOUND", message: "Gone" } })).toBe(true);
	});

	it.each([
		["null", null],
		["a string", "error"],
		["an object without error", { message: "Bad" }],
		["error set to null", { error: null }],
		["error as a string", { error: "Bad" }],
		["error without a code", { error: { message: "Bad" } }],
		["a numeric code", { error: { code: 404 } }],
	])("rejects %s", (_label, value) => {
		expect(isErrorEnvelope(value)).toBe(false);
	});
});

function apiError(status: number, code: ApiErrorCode, extra: object = {}) {
	return { status, error: { code, message: "Server message", ...extra } };
}
describe("error type checks", () => {
	it.each([
		["isValidationError", isValidationError, 400, "VALIDATION_ERROR"],
		["isUnauthorized", isUnauthorized, 401, "UNAUTHORIZED"],
		["isNotFound", isNotFound, 404, "NOT_FOUND"],
		["isConflict", isConflict, 409, "CONFLICT"],
		["isInternalError", isInternalError, 500, "INTERNAL_ERROR"],
		["isServiceUnavailable", isServiceUnavailable, 503, "SERVICE_UNAVAILABLE"],
	] as const)("%s works from the code or the HTTP status", (_name, check, status, code) => {
		expect(check(apiError(status, code))).toBe(true);
		expect(check(apiError(200, code))).toBe(true);
		expect(check(apiError(418, "UNKNOWN_ERROR"))).toBe(false);
	});

	it.each([
		["isUnauthorized", isUnauthorized, 401],
		["isNotFound", isNotFound, 404],
		["isConflict", isConflict, 409],
		["isInternalError", isInternalError, 500],
		["isServiceUnavailable", isServiceUnavailable, 503],
	] as const)("%s works from the HTTP status alone", (_name, check, status) => {
		expect(check(apiError(status, "UNKNOWN_ERROR"))).toBe(true);
	});

	it("returns false for things that are not API errors", () => {
		expect(isNotFound(new Error("boom"))).toBe(false);
		expect(isNotFound(null)).toBe(false);
		expect(isNotFound({ status: 404 })).toBe(false);
	});
});

describe("getFieldErrors and getErrorMessage", () => {
	it("returns fields only for VALIDATION_ERROR", () => {
		const fields = { role: "Required" };

		expect(getFieldErrors(apiError(400, "VALIDATION_ERROR", { fields }))).toEqual(fields);
		expect(getFieldErrors(apiError(409, "CONFLICT", { fields }))).toEqual({});
	});

	it("returns an empty object when a validation error has no fields", () => {
		expect(getFieldErrors(apiError(400, "VALIDATION_ERROR"))).toEqual({});
	});

	it("returns an empty object for things that are not API errors", () => {
		expect(getFieldErrors(new Error("boom"))).toEqual({});
	});

	it("uses the server message for API errors", () => {
		expect(getErrorMessage(apiError(404, "NOT_FOUND"), "Try again")).toBe("Server message");
	});

	it("uses the default fallback when none is given", () => {
		expect(getErrorMessage("boom")).toBe("Something went wrong");
	});
});
