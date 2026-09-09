"use client";

import RouteError from "@/components/RouteError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Unhandled route error:", error);
  return <RouteError reset={reset} />;
}