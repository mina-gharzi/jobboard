export const JOB_SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "salary", label: "بیشترین حقوق" },
] as const;

export type JobSort = (typeof JOB_SORTS)[number]["value"];