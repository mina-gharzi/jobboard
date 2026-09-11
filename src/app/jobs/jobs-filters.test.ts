import { describe, expect, it } from "vitest";
import {
  SALARY_RANGES,
  parseRemote,
  parseSalaryKey,
  salaryWhere,
} from "./jobs-filters";
import { RemoteType } from "@/generated/prisma";

describe("parseRemote", () => {
  it("مقادیر معتبر enum را پذیرفت و برمی‌گرداند", () => {
    expect(parseRemote("ONSITE")).toBe(RemoteType.ONSITE);
    expect(parseRemote("REMOTE")).toBe(RemoteType.REMOTE);
    expect(parseRemote("HYBRID")).toBe(RemoteType.HYBRID);
  });

  it("مقادیر نامعتبر و خالی را null می‌کند", () => {
    expect(parseRemote(undefined)).toBeNull();
    expect(parseRemote("onsite")).toBeNull();
    expect(parseRemote("FULLTIME")).toBeNull();
    expect(parseRemote("")).toBeNull();
  });
});

describe("parseSalaryKey", () => {
  it("کلیدهای معتبر را به بازه نگاشت می‌کند", () => {
    expect(parseSalaryKey("10")).toBe(SALARY_RANGES[1]);
    expect(parseSalaryKey("30")).toBe(SALARY_RANGES[2]);
    expect(parseSalaryKey("100+")).toBe(SALARY_RANGES[5]);
  });

  it("«همه» را null می‌کند چون فیلتر ندارد", () => {
    expect(parseSalaryKey("all")).toBeNull();
    expect(parseSalaryKey(undefined)).toBeNull();
  });

  it("کلید ناشناخته را null می‌کند", () => {
    expect(parseSalaryKey("999")).toBeNull();
    expect(parseSalaryKey("")).toBeNull();
  });
});

describe("salaryWhere", () => {
  it("برای «هر بازه‌ای» فقط شرط وجود حقوق را می‌سازد", () => {
    expect(salaryWhere(SALARY_RANGES[0])).toEqual({
      AND: [
        {
          OR: [{ salaryMin: { not: null } }, { salaryMax: { not: null } }],
        },
        {
          OR: [
            { salaryMax: { gte: 0 } },
            { salaryMax: null, salaryMin: { gte: 0 } },
          ],
        },
      ],
    });
  });

  it("بازه‌ی بسته هر دو حد را چک می‌کند", () => {
    expect(salaryWhere(SALARY_RANGES[2])).toEqual({
      AND: [
        {
          OR: [{ salaryMin: { not: null } }, { salaryMax: { not: null } }],
        },
        {
          OR: [
            { salaryMax: { gte: 10_000_000 } },
            { salaryMax: null, salaryMin: { gte: 10_000_000 } },
          ],
        },
        {
          OR: [
            { salaryMin: { lte: 30_000_000 } },
            { salaryMin: null, salaryMax: { lte: 30_000_000 } },
          ],
        },
      ],
    });
  });

  it("بازه‌ی آزاد بالایی فقط حد پایین را چک می‌کند", () => {
    const result = salaryWhere(SALARY_RANGES[5]);
    expect(result.AND).toHaveLength(2);
  });

  it("آگهی‌های بدون حقوق با هیچ بازه‌ای تطبیق ندارند", () => {
    const result = salaryWhere(SALARY_RANGES[1]);
    const first = (result.AND as unknown[])[0] as {
      OR: Record<string, unknown>[];
    };
    expect(first.OR).toEqual([
      { salaryMin: { not: null } },
      { salaryMax: { not: null } },
    ]);
  });
});