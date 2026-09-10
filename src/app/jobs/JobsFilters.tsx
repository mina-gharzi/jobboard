"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { REMOTE_FILTERS, SALARY_RANGES } from "./jobs-filters";

type Props = {
  remote: string | null;
  salary: string | null;
  q?: string;
  city?: string;
  category?: string;
  sort?: string;
};

export default function JobsFilters({
  remote,
  salary,
  q,
  city,
  category,
  sort,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(nextRemote: string, nextSalary: string) {
    const usp = new URLSearchParams();
    if (q) usp.set("q", q);
    if (city) usp.set("city", city);
    if (category) usp.set("category", category);
    if (sort && sort !== "newest") usp.set("sort", sort);
    if (nextRemote !== "all") usp.set("remote", nextRemote);
    if (nextSalary !== "all") usp.set("salary", nextSalary);
    const qs = usp.toString();
    startTransition(() => router.push(qs ? `/jobs?${qs}` : "/jobs"));
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <label className="flex items-center gap-2">
        <span className="text-xs font-bold text-ink-muted">نوع همکاری</span>
        <span className="relative">
          <select
            value={remote ?? "all"}
            onChange={(e) => navigate(e.target.value, salary ?? "all")}
            disabled={isPending}
            className="cursor-pointer appearance-none rounded-xl border border-ink/10 bg-white/70 py-1.5 pl-8 pr-3 text-xs font-bold text-ink shadow-sm backdrop-blur transition hover:border-gold/40 focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:opacity-60 md:py-2 md:text-sm"
          >
            {REMOTE_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
        </span>
      </label>

      <label className="flex items-center gap-2">
        <span className="text-xs font-bold text-ink-muted">بازه‌ی حقوق</span>
        <span className="relative">
          <select
            value={salary ?? "all"}
            onChange={(e) => navigate(remote ?? "all", e.target.value)}
            disabled={isPending}
            className="cursor-pointer appearance-none rounded-xl border border-ink/10 bg-white/70 py-1.5 pl-8 pr-3 text-xs font-bold text-ink shadow-sm backdrop-blur transition hover:border-gold/40 focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:opacity-60 md:py-2 md:text-sm"
          >
            {SALARY_RANGES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
        </span>
      </label>
    </div>
  );
}