"use client";

import RouteError from "@/components/RouteError";

export default function JobDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Job detail page error:", error);
  return <RouteError reset={reset} />;
}