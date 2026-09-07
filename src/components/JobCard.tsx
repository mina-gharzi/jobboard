import Link from "next/link";
import {
  remoteTypeLabels,
  formatSalary,
  formatRelativeTime,
} from "@/lib/format";
import type { RemoteType } from "@/generated/prisma/enums";

export type JobCardData = {
  slug: string;
  title: string;
  city: string;
  remoteType: RemoteType;
  category: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: Date;
  employer?: { name: string | null; image: string | null } | null;
};

export default function JobCard({
  job,
  index,
  footer,
}: {
  job: JobCardData;
  index?: number;
  footer?: React.ReactNode;
}) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const initial =
    job.employer?.name?.trim()?.[0] ?? job.category.trim()[0] ?? "؟";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_24px_48px_-16px_rgba(44,57,71,0.14)]">
      {/* نوار طلایی هنگام hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-6 right-0 w-0.75 origin-bottom scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100"
      />

      <Link href={`/jobs/${job.slug}`} className="flex-1 p-5">
        <div className="flex items-start gap-3.5">
          {/* لوگو */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate/10 text-lg font-bold text-slate-dark ring-1 ring-slate/10">
            {job.employer?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.employer.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          {/* عنوان و شرکت */}
          <div className="min-w-0 flex-1">
            {typeof index === "number" && (
              <span className="text-xs text-ink-muted">
                آگهی #{String(index + 1).padStart(4, "0")}
              </span>
            )}

            <h3 className="mt-0.5 truncate font-display text-base font-bold leading-6 text-ink md:text-lg">
              {job.title}
            </h3>

            {job.employer?.name && (
              <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-ink-muted">
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 9h4a2 2 0 0 1 2 2v10" />
                </svg>
                <span className="truncate">{job.employer.name}</span>
              </p>
            )}
          </div>

          {/* دسته‌بندی */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="inline-flex items-center rounded-full border border-slate/20 bg-slate/5 px-3 py-1 text-xs font-semibold text-slate-dark transition-colors duration-300 group-hover:border-gold/25 group-hover:bg-gold/5">
              {job.category}
            </span>
          </div>
        </div>

        {/* جزئیات شغلی */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {job.city}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {remoteTypeLabels[job.remoteType]}
            </span>

            {salary && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <svg
                  className="h-4 w-4 shrink-0 text-ink-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                {salary}
              </span>
            )}
          </div>

          <span className="shrink-0 text-xs text-ink-muted/70">
            {formatRelativeTime(job.createdAt)}
          </span>
        </div>
      </Link>

      {footer && (
        <div className="mt-auto flex items-center justify-between border-t border-line bg-slate/5 px-5 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}
