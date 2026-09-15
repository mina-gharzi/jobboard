import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import JobCard from "@/components/JobCard";
import type { JobCardData } from "@/components/JobCard";
import type { JobData } from "./types";

type Props = { jobs: JobData[] };

export default function LatestJobs({ jobs }: Props) {
  const typedJobs = jobs as JobCardData[];
  return (
    <section className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-0 h-64 w-64 rounded-full bg-gold/4 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-slate/4 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted">
              <span className="h-px w-8 rounded-full bg-gold/40" />جدیدترین فرصت‌ها
            </span>
            <h2 className="mt-3 text-2xl font-black text-ink md:text-4xl">آخرین آگهی‌های استخدام</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">تازه‌ترین موقعیت‌های شغلی که شرکت‌ها منتشر کرده‌اند را همین‌جا مشاهده کنید.</p>
          </div>
          <Link href="/jobs" className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-6 py-3 text-sm font-semibold text-ink shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.4)] focus-visible:outline-none focus-visible:border-gold/40 focus-visible:ring-4 focus-visible:ring-gold/25">
            مشاهده همه آگهی‌ها
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        {typedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {typedJobs.map((job, index) => (
              <JobCard key={job.slug} job={job} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/10 bg-white/50 p-16 text-center text-ink-muted backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Search className="h-7 w-7 text-gold" strokeWidth={1.8} />
            </div>
            هنوز فرصت شغلی منتشر نشده است.
          </div>
        )}
      </div>
    </section>
  );
}