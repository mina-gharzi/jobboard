import { describe, expect, it } from "vitest";
import {
  formatRelativeTime,
  formatSalary,
  remoteTypeLabels,
  remoteTypeOptions,
} from "./format";
import { RemoteType } from "@/generated/prisma/enums";

describe("remoteTypeLabels", () => {
  it("تمام اعضای enum را به فارسی ترجمه می‌کند", () => {
    expect(remoteTypeLabels).toEqual({
      ONSITE: "حضوری",
      REMOTE: "دورکاری",
      HYBRID: "ترکیبی",
    });
  });

  it("remoteTypeOptions یک گزینه برای هر اعضای enum دارد", () => {
    expect(remoteTypeOptions).toHaveLength(3);
    expect(remoteTypeOptions).toEqual(
      Object.values(RemoteType).map((value) => ({
        value,
        label: remoteTypeLabels[value],
      }))
    );
  });
});

describe("formatSalary", () => {
  it("وقتی هر دو حد خالی است null برمی‌گرداند", () => {
    expect(formatSalary(null, null)).toBeNull();
    expect(formatSalary(undefined, undefined)).toBeNull();
  });

  it("وقتی فقط سقف دارد «تا X تومان» می‌سازد", () => {
    expect(formatSalary(null, 2_500_000)).toBe("تا ۲٬۵۰۰٬۰۰۰ تومان");
  });

  it("وقتی فقط کف دارد «از X تومان» می‌سازد", () => {
    expect(formatSalary(1_500_000, null)).toBe("از ۱٬۵۰۰٬۰۰۰ تومان");
  });

  it("وقتی هر دو حد دارد بازه می‌سازد", () => {
    expect(formatSalary(1_500_000, 2_500_000)).toBe(
      "۱٬۵۰۰٬۰۰۰ تا ۲٬۵۰۰٬۰۰۰ تومان"
    );
  });
});

describe("formatRelativeTime", () => {
  const daysAgo = (days: number) => new Date(Date.now() - days * 86400000);

  it("فاصله‌ی کمتر از یک روز را «امروز» نشان می‌دهد", () => {
    expect(formatRelativeTime(new Date())).toBe("امروز");
    expect(formatRelativeTime(daysAgo(0))).toBe("امروز");
  });

  it("فاصله‌ی یک روز را «دیروز» نشان می‌دهد", () => {
    expect(formatRelativeTime(daysAgo(1))).toBe("دیروز");
  });

  it("فاصله‌ی کمتر از یک هفته را به روز نشان می‌دهد", () => {
    expect(formatRelativeTime(daysAgo(5))).toBe("۵ روز پیش");
  });

  it("فاصله‌ی کمتر از یک ماه را به هفته نشان می‌دهد", () => {
    expect(formatRelativeTime(daysAgo(20))).toBe("۲ هفته پیش");
  });

  it("فاصله‌ی یک ماه و بیشتر را تاریخ کامل فارسی نشان می‌دهد", () => {
    const d = daysAgo(100);
    const expected = new Date(d).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(formatRelativeTime(d)).toBe(expected);
  });
});