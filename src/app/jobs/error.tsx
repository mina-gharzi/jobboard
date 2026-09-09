"use client";

import RouteError from "@/components/RouteError";

export default function JobsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Jobs page error:", error);
  return <RouteError reset={reset} />;
}