"use client";

import RouteError from "@/components/RouteError";

export default function EditJobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("employer/jobs/[id]/edit error:", error);
  return (
    <RouteError
      reset={reset}
      title="بارگذاری آگهی ناموفق بود"
      description="دریافت اطلاعات این آگهی با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    />
  );
}