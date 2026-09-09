"use client";

import RouteError from "@/components/RouteError";

export default function CandidateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Candidate page error:", error);
  return <RouteError reset={reset} />;
}