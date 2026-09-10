"use client";

import RouteError from "@/components/RouteError";

export default function NewJobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("employer/new error:", error);
  return (
    <RouteError
      reset={reset}
      title="بارگذاری فرم ثبت آگهی ناموفق بود"
      description="دریافت اطلاعات لازم برای ثبت آگهی با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    />
  );
}