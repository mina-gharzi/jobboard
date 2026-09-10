"use client";

import RouteError from "@/components/RouteError";

export default function CompanyProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("employer/company error:", error);
  return (
    <RouteError
      reset={reset}
      title="بارگذاری پروفایل شرکت ناموفق بود"
      description="دریافت اطلاعات شرکت شما با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    />
  );
}