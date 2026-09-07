import { z } from "zod";

/**
 * FormData.get() می‌تواند null یا File برگرداند؛ این تابع همیشه یک رشته
 * برمی‌گرداند تا خطاهای Zod به‌جای "Expected string" پیام فارسی مفهومی بدهند.
 */
export function toStr(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

const optionalSalary = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.coerce
  .number({ invalid_type_error: "مقدار حقوق باید عدد باشد" })
  .nonnegative("حقوق نمی‌تواند منفی باشد")
  .optional());

const remoteTypeSchema = z.enum(["ONSITE", "REMOTE", "HYBRID"], {
  errorMap: () => ({ message: "نوع همکاری نامعتبر است" }),
});

const jobStatusSchema = z.enum(["DRAFT", "PUBLISHED", "CLOSED"], {
  errorMap: () => ({ message: "وضعیت آگهی نامعتبر است" }),
});

const applicationStatusSchema = z.enum(
  ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"],
  { errorMap: () => ({ message: "وضعیت درخواست نامعتبر است" }) }
);

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
  category: z
    .string()
    .trim()
    .min(2, "دسته‌بندی را وارد کنید")
    .max(100, "دسته‌بندی بیش از حد طولانی است"),
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
