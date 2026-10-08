import { describe, expect, it } from "vitest";
import { DEFAULT_ROLE, isRole, normalizeRole } from "./roles";

describe("roles", () => {
  it("accepts only the two real roles", () => {
    expect(isRole("CANDIDATE")).toBe(true);
    expect(isRole("EMPLOYER")).toBe(true);
    for (const bad of ["ADMIN", "candidate", "", null, undefined, 1, {}]) {
      expect(isRole(bad), String(bad)).toBe(false);
    }
  });

  it("falls back to CANDIDATE for anything else", () => {
    expect(normalizeRole("EMPLOYER")).toBe("EMPLOYER");
    expect(normalizeRole("ADMIN")).toBe(DEFAULT_ROLE);
    expect(normalizeRole(undefined)).toBe(DEFAULT_ROLE);
  });
});
