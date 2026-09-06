import Link from "next/link";
import { remoteTypeLabels, formatSalary, formatRelativeTime } from "@/lib/format";

export type JobCardData = {
  slug: string;
  title: string;
  city: string;
  remoteType: "ONSITE" | "REMOTE" | "HYBRID";
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
  const initial = job.employer?.name?.trim()?.[0] ?? job.category.trim()[0] ?? "؟";

  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate/10 text-lg font-bold text-slate-dark">
        {job.employer?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={job.employer.image} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {typeof index === "number" && (
              <span className="text-xs text-ink-muted">
                آگهی #{String(index + 1).padStart(4, "0")}
              </span>
            )}
            <h3 className="mt-0.5 truncate font-display text-lg font-bold text-ink">
              {job.title}
            </h3>
            {job.employer?.name && (
              <p className="mt-0.5 truncate text-sm text-ink-muted">{job.employer.name}</p>
            )}
          </div>

          <span className="shrink-0 rounded-full border border-slate/30 bg-slate/5 px-3 py-1 text-xs text-slate-dark">
            {job.category}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {job.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            {remoteTypeLabels[job.remoteType]}
          </span>
          {salary && (
            <span className="inline-flex items-center gap-1.5 text-ink">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M2 10h20" />
              </svg>
              {salary}
            </span>
          )}
          <span className="mr-auto text-xs text-ink-muted/70">
            {formatRelativeTime(job.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5 transition hover:border-gold hover:shadow-[0_14px_32px_rgba(44,57,71,0.08)]">
      {footer ? (
        <Link href={`/jobs/${job.slug}`} className="block">
          {content}
        </Link>
      ) : (
        <Link href={`/jobs/${job.slug}`} className="block">
          {content}
        </Link>
      )}
      {footer && <div className="mt-4 border-t border-line pt-3">{footer}</div>}
    </div>
  );
}