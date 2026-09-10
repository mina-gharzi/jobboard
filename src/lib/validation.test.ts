import { describe, expect, it } from "vitest";
import {
  applyToJobSchema,
  createJobSchema,
  toStr,
  updateApplicationStatusSchema,
  updateCompanyProfileSchema,
  updateJobSchema,
  updateProfileSchema,
} from "./validation";
import { JOB_CATEGORIES } from "./categories";
import { COMPANY_TEAM_SIZES } from "./companyTeamSizes";

const validJob = {
  title: "توسعه‌دهنده‌ی فرانت‌اند",
  description: "نیازمند توسعه‌دهنده‌ی فرانت‌اند با چند سال تجربه هستیم.",
  category: JOB_CATEGORIES[0],
  city: "تهران",
  remoteType: "REMOTE",
  salaryMin: "1500000",
  salaryMax: "2500000",
};

describe("toStr", () => {
  it("مقدار رشته را دست‌نخورده برمی‌گرداند", () => {
    expect(toStr("سلام")).toBe("سلام");
  });

  it("null را به رشته‌ی خالی تبدیل می‌کند", () => {
    expect(toStr(null)).toBe("");
  });

  it("فایل را به رشته‌ی خالی تبدیل می‌کند", () => {
    const file = new File(["x"], "resume.pdf", { type: "application/pdf" });
    expect(toStr(file)).toBe("");
  });
});

describe("createJobSchema", () => {
  it("آگهی معتبر را قبول می‌کند (با مقادیر FormData به‌صورت رشته)", () => {
    const result = createJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.salaryMin).toBe(1500000);
      expect(result.data.salaryMax).toBe(2500000);
    }
  });

  it("حقوق خالی را undefined می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, salaryMin: "", salaryMax: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.salaryMin).toBeUndefined();
      expect(result.data.salaryMax).toBeUndefined();
    }
  });

  it("عنوان کوتاه را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, title: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("عنوان باید حداقل ۳ کاراکتر باشد");
    }
  });

  it("عنوان بیش از حد طولانی را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, title: "a".repeat(151) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("عنوان بیش از حد طولانی است");
    }
  });

  it("توضیح کوتاه را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, description: "کوتاه" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("توضیحات باید حداقل ۲۰ کاراکتر باشد");
    }
  });

  it("نوع همکاری نامعتبر را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, remoteType: "FULLTIME" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("نوع همکاری نامعتبر است");
    }
  });

  it("دسته‌بندی خارج از فهرست را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, category: "حسابداری" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("دسته‌بندی نامعتبر است");
    }
  });

  it("حقوق منفی را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, salaryMin: "-5" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMin).toEqual([
        "حقوق نمی‌تواند منفی باشد",
      ]);
    }
  });

  it("حقوق غیرعددی را رد می‌کند", () => {
    const result = createJobSchema.safeParse({ ...validJob, salaryMax: "سلام" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMax).toEqual([
        "مقدار حقوق باید عدد باشد",
      ]);
    }
  });
});

describe("createJobSchema.refine — بازه‌ی حقوق", () => {
  it("وقتی حداقل بیشتر از حداکثر است رد می‌کند", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMin: "3000000",
      salaryMax: "2000000",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMin).toEqual([
        "حداقل حقوق نمی‌تواند بیشتر از حداکثر باشد",
      ]);
    }
  });

  it("وقتی یکی از حدها خالی است، بازه را نمی‌شکند", () => {
    const minOnly = createJobSchema.safeParse({ ...validJob, salaryMax: "" });
    const maxOnly = createJobSchema.safeParse({ ...validJob, salaryMin: "" });
    expect(minOnly.success).toBe(true);
    expect(maxOnly.success).toBe(true);
  });
});

describe("updateJobSchema", () => {
  it("وضعیت معتبر را می‌پذیرد", () => {
    const result = updateJobSchema.safeParse({ ...validJob, status: "CLOSED" });
    expect(result.success).toBe(true);
  });

  it("وضعیت نامعتبر را رد می‌کند", () => {
    const result = updateJobSchema.safeParse({ ...validJob, status: "DELETED" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.status).toEqual([
        "وضعیت آگهی نامعتبر است",
      ]);
    }
  });
});

describe("applyToJobSchema", () => {
  it("بدون انگیزه‌نامه موفق است", () => {
    const result = applyToJobSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("انگیزه‌نامه‌ی معتبر را قبول می‌کند", () => {
    const result = applyToJobSchema.safeParse({
      coverLetter: "به این موقعیت علاقه‌مندم.",
    });
    expect(result.success).toBe(true);
  });

  it("انگیزه‌نامه‌ی بیش از ۲۰۰۰ کاراکتر را رد می‌کند", () => {
    const result = applyToJobSchema.safeParse({
      coverLetter: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "متن انگیزه‌نامه بیش از حد طولانی است"
      );
    }
  });
});

describe("updateApplicationStatusSchema", () => {
  it("وضعیت معتبر را می‌پذیرد", () => {
    expect(
      updateApplicationStatusSchema.safeParse({ applicationId: "x", status: "ACCEPTED" })
        .success
    ).toBe(true);
  });

  it("applicationId خالی را رد می‌کند", () => {
    const result = updateApplicationStatusSchema.safeParse({
      applicationId: "",
      status: "PENDING",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("شناسه‌ی درخواست نامعتبر است");
    }
  });

  it("وضعیت نامعتبر را رد می‌کند", () => {
    const result = updateApplicationStatusSchema.safeParse({
      applicationId: "x",
      status: "PENDINGG",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("وضعیت درخواست نامعتبر است");
    }
  });
});

describe("updateProfileSchema", () => {
  it("پروفایل خالی (فقط پاک‌کردنی) را می‌پذیرد", () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
    expect(updateProfileSchema.safeParse({ phone: "", bio: "" }).success).toBe(true);
  });

  it("شماره‌ی تماس معتبر را قبول می‌کند", () => {
    expect(updateProfileSchema.safeParse({ phone: "0912 345 6789" }).success).toBe(true);
  });

  it("شماره‌ی تماس با کاراکتر نامعتبر را رد می‌کند", () => {
    const result = updateProfileSchema.safeParse({ phone: "0912abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("فقط می‌تواند");
    }
  });

  it("بازارشناسی بیش از ۶۰۰ کاراکتر را رد می‌کند", () => {
    const result = updateProfileSchema.safeParse({ bio: "a".repeat(601) });
    expect(result.success).toBe(false);
  });
});

describe("updateCompanyProfileSchema", () => {
  const validCompany = {
    name: "گروه نرم‌افزاری جابینو",
    companyDescription: "تیم توسعه‌ی محصولات وب",
    companyWebsite: "https://example.com",
    companyTeamSize: COMPANY_TEAM_SIZES[1],
  };

  it("پروفایل شرکت معتبر را می‌پذیرد", () => {
    expect(updateCompanyProfileSchema.safeParse(validCompany).success).toBe(true);
  });

  it("نام خالی را رد می‌کند", () => {
    const result = updateCompanyProfileSchema.safeParse({ ...validCompany, name: " " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("نام شرکت نمی‌تواند خالی باشد");
    }
  });

  it("وب‌سایت http/https را قبول می‌کند", () => {
    expect(updateCompanyProfileSchema.safeParse({ ...validCompany, companyWebsite: "https://example.com" }).success).toBe(true);
  });

  it("پروتکل غیر-http (ftp) را به‌خاطر امنیت رد می‌کند", () => {
    const result = updateCompanyProfileSchema.safeParse({ ...validCompany, companyWebsite: "ftp://example.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "آدرس وب‌سایت باید با http یا https شروع شود"
      );
    }
  });

  it("لینک javascript: را رد می‌کند (الگوی XSS)", () => {
    const result = updateCompanyProfileSchema.safeParse({ ...validCompany, companyWebsite: "javascript:alert(1)" });
    expect(result.success).toBe(false);
  });

  it("لینک data: را رد می‌کند (الگوی XSS)", () => {
    const result = updateCompanyProfileSchema.safeParse({ ...validCompany, companyWebsite: "data:text/html;base64,PHNjcmlwdD4=" });
    expect(result.success).toBe(false);
  });

  it("وب‌سایت خالی یعنی بدون تغییر و پذیرفته می‌شود", () => {
    expect(updateCompanyProfileSchema.safeParse({ ...validCompany, companyWebsite: "" }).success).toBe(true);
  });

  it("اندازه‌ی تیم خارج از گزینه‌ها را رد می‌کند", () => {
    const result = updateCompanyProfileSchema.safeParse({ ...validCompany, companyTeamSize: "خیلی بزرگ" });
    expect(result.success).toBe(false);
  });
});