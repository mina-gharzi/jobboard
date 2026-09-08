// گزینه‌های اندازه‌ی تیم برای پروفایل شرکت. به‌صورت رشته‌ی ثابت ذخیره می‌شن
// چون کل اپلیکیشن فارسی‌زبانه و نیازی به لایه‌ی ترجمه نیست.
export const COMPANY_TEAM_SIZES = [
  "۱ تا ۱۰ نفر",
  "۱۱ تا ۵۰ نفر",
  "۵۱ تا ۲۰۰ نفر",
  "بیش از ۲۰۰ نفر",
] as const;

export type CompanyTeamSize = (typeof COMPANY_TEAM_SIZES)[number];
