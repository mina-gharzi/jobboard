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

/* ───────── آیکون‌های دسته‌بندی ───────── */

type CategoryVisual = {
  icon: React.ReactNode;
  bg: string;
  ring: string;
  text: string;
};

const categoryVisuals: { keywords: string[]; visual: CategoryVisual }[] = [
  {
    keywords: [
      "برنامه‌نویسی", "توسعه", "developer", "programming", "frontend",
      "backend", "fullstack", "software", "engineering", "react", "node",
      "python", "java", "typescript", "devops",
    ],
    visual: {
      bg: "bg-sky-50",
      ring: "ring-sky-200/50",
      text: "text-sky-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      ),
    },
  },
  {
    keywords: [
      "طراحی", "design", "ui", "ux", "graphic", "موشن", "گرافیک",
      "تجربه کاربری", "بصری",
    ],
    visual: {
      bg: "bg-violet-50",
      ring: "ring-violet-200/50",
      text: "text-violet-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
      ),
    },
  },
  {
    keywords: [
      "مارکتینگ", "بازاریابی", "marketing", "seo", "دیجیتال مارکتینگ",
      "تبلیغات", "محتوا", "content",
    ],
    visual: {
      bg: "bg-amber-50",
      ring: "ring-amber-200/50",
      text: "text-amber-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l18-5v12L3 13v-2z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      ),
    },
  },
  {
    keywords: ["فروش", "sales", "vip", "zendegi"],
    visual: {
      bg: "bg-emerald-50",
      ring: "ring-emerald-200/50",
      text: "text-emerald-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l5-5" />
          <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l5-5" />
        </svg>
      ),
    },
  },
  {
    keywords: [
      "مالی", "حسابداری", "finance", "accounting", "بیمه", "سرمایه",
    ],
    visual: {
      bg: "bg-teal-50",
      ring: "ring-teal-200/50",
      text: "text-teal-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
  },
  {
    keywords: [
      "منابع انسانی", "human resources", "hr", "استخدام", "جذب",
    ],
    visual: {
      bg: "bg-rose-50",
      ring: "ring-rose-200/50",
      text: "text-rose-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  },
  {
    keywords: ["آموزش", "teaching", "آموزگار", "استاد", "معلم"],
    visual: {
      bg: "bg-indigo-50",
      ring: "ring-indigo-200/50",
      text: "text-indigo-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      ),
    },
  },
  {
    keywords: ["پشتیبانی", "support", "خدمات مشتری", "service"],
    visual: {
      bg: "bg-cyan-50",
      ring: "ring-cyan-200/50",
      text: "text-cyan-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  },
  {
    keywords: ["مدیریت", "management", "مدیر", "leads", "oprations"],
    visual: {
      bg: "bg-orange-50",
      ring: "ring-orange-200/50",
      text: "text-orange-600",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12V6" />
          <path d="M18.5 15.5a6.5 6.5 0 1 1-13 0" />
          <path d="M8 15.5h8" />
        </svg>
      ),
    },
  },
];

const fallbackVisual: CategoryVisual = {
  bg: "bg-slate/10",
  ring: "ring-slate/20",
  text: "text-slate-dark",
  icon: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="6" y="12" width="12" height="8" rx="1" />
    </svg>
  ),
};

function getCategoryVisual(category: string): CategoryVisual {
  const q = category.trim().toLowerCase();
  return (
    categoryVisuals.find((item) =>
      item.keywords.some((k) => q.includes(k.toLowerCase()))
    )?.visual ?? fallbackVisual
  );
}

/* ───────── کامپوننت ───────── */

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
  const visual = getCategoryVisual(job.category);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_24px_48px_-16px_rgba(44,57,71,0.14)]">
      {/* نوار طلایی هنگام hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-6 right-0 w-0.75 origin-bottom scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100"
      />

      <Link href={`/jobs/${job.slug}`} className="flex-1 p-5">
        <div className="flex items-start gap-3.5">
          {/* آیکون دسته‌بندی */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${visual.bg} ${visual.ring} ${visual.text} transition-transform duration-300 group-hover:scale-105`}
          >
            {visual.icon}
          </div>

          {/* عنوان و شرکت */}
          <div className="min-w-0 flex-1">
            {typeof index === "number" && (
              <span className="text-xs text-ink-muted">
                آگهی #{String(index + 1).padStart(4, "0")}
              </span>
            )}

            <h3 className="mt-0.5 truncate font-display text-base font-bold leading-6 text-ink transition-colors group-hover:text-gold md:text-lg">
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
          <span className="shrink-0 rounded-full border border-slate/20 bg-slate/5 px-3 py-1 text-xs font-semibold text-slate-dark transition-colors duration-300 group-hover:border-gold/25 group-hover:bg-gold/5">
            {job.category}
          </span>
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
