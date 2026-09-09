"use client";

import RouteError from "@/components/RouteError";

export default function EmployerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Employer page error:", error);
  return <RouteError reset={reset} />;
}