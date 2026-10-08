// نقش‌های مجاز اپ. تنها منبع حقیقت؛ هم auth.ts و هم صفحه‌ی ثبت‌نام می‌توانند
// از همین‌جا استفاده کنند.
export const ROLES = ["CANDIDATE", "EMPLOYER"] as const;
export type Role = (typeof ROLES)[number];

export const DEFAULT_ROLE: Role = "CANDIDATE";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** هر مقدار نامعتبر (مثلاً "ADMIN" یا undefined) به نقش پیش‌فرض برمی‌گردد. */
export function normalizeRole(value: unknown): Role {
  return isRole(value) ? value : DEFAULT_ROLE;
}
