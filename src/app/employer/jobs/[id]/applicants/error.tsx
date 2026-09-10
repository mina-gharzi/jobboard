"use client";

import RouteError from "@/components/RouteError";

export default function ApplicantsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("employer/jobs/[id]/applicants error:", error);
  return (
    <RouteError
      reset={reset}
      title="بارگذاری درخواست‌های آگهی ناموفق بود"
      description="دریافت لیست متقاضیان این آگهی با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    />
  );
}