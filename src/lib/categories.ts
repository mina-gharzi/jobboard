export const JOB_CATEGORIES = [
  "فرانت‌اند",
  "بک‌اند",
  "فول‌استک",
  "موبایل",
  "دواپس",
  "طراحی محصول (UI/UX)",
  "مدیریت محصول",
  "دیتا و هوش مصنوعی",
  "تضمین کیفیت (QA)",
  "پشتیبانی فنی",
  "سایر",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
