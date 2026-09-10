import { describe, expect, it } from "vitest";
import { buildSearchTerms } from "./search";

const ZWNJ = "\u200C";

describe("buildSearchTerms", () => {
  it("ورودی خالی بدون واریانت است", () => {
    expect(buildSearchTerms("")).toEqual([]);
    expect(buildSearchTerms("   ")).toEqual([]);
  });

  it("عبارت تک‌نویسه نیم‌فاصله فقط خودش را برمی‌گرداند", () => {
    expect(buildSearchTerms(ZWNJ)).toEqual([ZWNJ]);
  });

  it("عبارت بدون نیم‌فاصله فقط خودش را برمی‌گرداند", () => {
    expect(buildSearchTerms("توسعه")).toEqual(["توسعه"]);
  });

  it("برای عبارت با نیم‌فاصله، هر دو شکل معادل را می‌سازد", () => {
    const terms = buildSearchTerms(`فرانت${ZWNJ}اند`);
    expect(terms).toEqual([`فرانت${ZWNJ}اند`, "فرانتاند", "فرانت اند"]);
  });

  it("برای عبارت با فاصله‌ی معمولی، شکل نیم‌فاصله‌دار را هم می‌سازد", () => {
    const terms = buildSearchTerms("فرانت اند");
    expect(terms).toEqual(["فرانت اند", `فرانت${ZWNJ}اند`, "فرانتاند"]);
  });

  it("فاصله‌های چندگانه جمع می‌شوند", () => {
    const terms = buildSearchTerms("فرانت  اند");
    expect(terms[0]).toBe("فرانت  اند");
    expect(terms).toContain(`فرانت${ZWNJ}اند`);
    expect(terms).toContain("فرانتاند");
    expect(terms).toContain("فرانت اند");
  });

  it("خروجی فاقد مقدار تکراری است", () => {
    const terms = buildSearchTerms("توسعه");
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("فاصله‌ی ابتدا و انتها حذف می‌شود", () => {
    const terms = buildSearchTerms("  توسعه  ");
    expect(terms).toEqual(["توسعه"]);
  });
});