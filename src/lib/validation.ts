import { z } from "zod";
import { RemoteType, JobStatus, ApplicationStatus, Role } from "@/generated/prisma/enums";
import { JOB_CATEGORIES } from "@/lib/categories";
import { COMPANY_TEAM_SIZES } from "@/lib/companyTeamSizes";

/**
 * FormData.get() می‌تواند null یا File برگرداند؛ این تابع همیشه یک رشته
 * برمی‌گرداند تا خطاهای Zod به‌جای "Expected string" پیام فارسی مفهومی بدهند.
 */
export function toStr(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

/**
 * z.url() فقط syntactically معتبر بودن URL رو چک می‌کند، نه scheme را —
 * یعنی چیزی مثل "javascript:..." یا "data:..." را هم قبول می‌کند. چون
 * این لینک‌ها بعداً به‌صورت <a href={...}> به کاربرهای دیگر (کارفرما،
 * کارجو، بازدیدکننده‌ی صفحه‌ی آگهی) نمایش داده می‌شوند، این چک اضافه
 * تضمین می‌کند فقط http/https ذخیره شود — در غیر این صورت کلیک روی لینک
 * می‌توانست کد دلخواه را در مرورگر قربانی اجرا کند.
 */
const isHttpUrl = (val: string) => /^https?:\/\//i.test(val);

const optionalSalary = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.coerce
  .number({ invalid_type_error: "مقدار حقوق باید عدد باشد" })
  .nonnegative("حقوق نمی‌تواند منفی باشد")
  .optional());

// این Enumها مستقیماً از generated/prisma/enums.ts می‌آیند، نه رشته‌های
// دستی جدا — اگر روزی مقداری به schema.prisma اضافه/حذف شود، همین‌جا و
// فقط همین‌جا (بعد از prisma generate) به‌روزرسانی می‌شود.
const remoteTypeSchema = z.nativeEnum(RemoteType, {
  errorMap: () => ({ message: "نوع همکاری نامعتبر است" }),
});

const jobStatusSchema = z.nativeEnum(JobStatus, {
  errorMap: () => ({ message: "وضعیت آگهی نامعتبر است" }),
});

const applicationStatusSchema = z.nativeEnum(ApplicationStatus, {
  errorMap: () => ({ message: "وضعیت درخواست نامعتبر است" }),
});

export const userRoleSchema = z.nativeEnum(Role);

const categorySchema = z.enum(JOB_CATEGORIES, {
  errorMap: () => ({ message: "دسته‌بندی نامعتبر است" }),
});

const jobFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(150, "عنوان بیش از حد طولانی است"),
  description: z
    .string()
    .trim()
    .min(20, "توضیحات باید حداقل ۲۰ کاراکتر باشد")
    .max(5000, "توضیحات بیش از حد طولانی است"),
  category: categorySchema,
  city: z
    .string()
    .trim()
    .min(2, "شهر را وارد کنید")
    .max(100, "نام شهر بیش از حد طولانی است"),
  remoteType: remoteTypeSchema,
  salaryMin: optionalSalary,
  salaryMax: optionalSalary,
});

function refineSalaryRange<T extends { salaryMin?: number; salaryMax?: number }>(
  data: T
) {
  return (
    data.salaryMin === undefined ||
    data.salaryMax === undefined ||
    data.salaryMin <= data.salaryMax
  );
}

export const createJobSchema = jobFieldsSchema.refine(refineSalaryRange, {
  message: "حداقل حقوق نمی‌تواند بیشتر از حداکثر باشد",
  path: ["salaryMin"],
});

export const updateJobSchema = jobFieldsSchema
  .extend({ status: jobStatusSchema })
  .refine(refineSalaryRange, {
    message: "حداقل حقوق نمی‌تواند بیشتر از حداکثر باشد",
    path: ["salaryMin"],
  });

export const applyToJobSchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .max(2000, "متن انگیزه‌نامه بیش از حد طولانی است")
    .optional(),
});

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().min(1, "شناسه‌ی درخواست نامعتبر است"),
  status: applicationStatusSchema,
});

/**
 * فیلدهای پروفایل همگی اختیاری‌اند؛ رشته‌ی خالی هم مجاز است (یعنی کاربر
 * می‌تواند مقدار قبلی را پاک کند). در اکشن سرور، رشته‌ی خالی به null
 * تبدیل می‌شود تا در دیتابیس یکدست ذخیره شود.
 */
export const updateProfileSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(20, "شماره تماس بیش از حد طولانی است")
    .regex(/^[0-9+\-\s]*$/, "شماره تماس فقط می‌تواند شامل عدد، فاصله، + و - باشد")
    .optional()
    .or(z.literal("")),
  resumeUrl: z
    .string()
    .trim()
    .max(500, "لینک بیش از حد طولانی است")
    .url("لینک رزومه معتبر نیست (باید با http یا https شروع شود)")
    .refine(isHttpUrl, "لینک رزومه باید با http یا https شروع شود")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(600, "معرفی کوتاه نباید بیشتر از ۶۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
});

/**
 * فیلدهای پروفایل شرکت. مثل پروفایل کارجو، همه اختیاری‌اند و رشته‌ی خالی
 * یعنی «پاک کردن» مقدار قبلی.
 */
export const updateCompanyProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام شرکت نمی‌تواند خالی باشد")
    .max(100, "نام شرکت بیش از حد طولانی است"),
  companyDescription: z
    .string()
    .trim()
    .max(800, "توضیحات شرکت نباید بیشتر از ۸۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  companyWebsite: z
    .string()
    .trim()
    .max(300, "لینک بیش از حد طولانی است")
    .url("آدرس وب‌سایت معتبر نیست (باید با http یا https شروع شود)")
    .refine(isHttpUrl, "آدرس وب‌سایت باید با http یا https شروع شود")
    .optional()
    .or(z.literal("")),
  companyTeamSize: z
    .enum(COMPANY_TEAM_SIZES)
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .trim()
    .max(500, "لینک بیش از حد طولانی است")
    .url("لینک لوگو معتبر نیست (باید با http یا https شروع شود)")
    .refine(isHttpUrl, "لینک لوگو باید با http یا https شروع شود")
    .optional()
    .or(z.literal("")),
});
