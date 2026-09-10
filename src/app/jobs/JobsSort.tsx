"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { JOB_SORTS, type JobSort } from "./jobs-sort";

type Props = {
  sort: JobSort;
  q?: string;
  city?: string;
  category?: string;
  remote?: string | null;
  salary?: string | null;
};

export default function JobsSort({
  sort,
  q,
  city,
  category,
  remote,
  salary,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const usp = new URLSearchParams();
    if (q) usp.set("q", q);
    if (city) usp.set("city", city);
    if (category) usp.set("category", category);
    if (e.target.value !== "newest") usp.set("sort", e.target.value);
    if (remote && remote !== "all") usp.set("remote", remote);
    if (salary && salary !== "all") usp.set("salary", salary);
    const qs = usp.toString();
    startTransition(() => router.push(qs ? `/jobs?${qs}` : "/jobs"));
  }

  return (
    <div className="relative">
      <label htmlFor="jobs-sort" className="sr-only">
        مرتب‌سازی نتایج
      </label>
      <select
        id="jobs-sort"
        value={sort}
        onChange={handleChange}
        disabled={isPending}
        className="cursor-pointer appearance-none rounded-xl border border-ink/10 bg-white/70 py-2 pl-9 pr-3.5 text-xs font-bold text-ink shadow-sm backdrop-blur transition hover:border-gold/40 focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:opacity-60 md:py-2.5 md:text-sm"
      >
        {JOB_SORTS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}