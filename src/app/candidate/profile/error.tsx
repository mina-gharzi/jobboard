"use client";

import RouteError from "@/components/RouteError";

export default function CandidateProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("candidate/profile error:", error);
  return (
    <RouteError
      reset={reset}
      title="بارگذاری پروفایل ناموفق بود"
      description="دریافت اطلاعات پروفایل شما با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    />
  );
}