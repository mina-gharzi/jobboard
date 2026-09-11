import Link from "next/link";
import {
  Building,
  Building2,
  Briefcase,
  Code,
  CreditCard,
  Gauge,
  GraduationCap,
  Handshake,
  Headphones,
  MapPin,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import {
  remoteTypeLabels,
  formatSalary,
  formatRelativeTime,
} from "@/lib/format";
import type { RemoteType } from "@/generated/prisma";

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
        <Code className="h-6 w-6" strokeWidth={1.5} />
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
        <Sparkles className="h-6 w-6" strokeWidth={1.5} />
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
        <Megaphone className="h-6 w-6" strokeWidth={1.5} />
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
        <Handshake className="h-6 w-6" strokeWidth={1.5} />
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
        <CreditCard className="h-6 w-6" strokeWidth={1.5} />
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
        <Users className="h-6 w-6" strokeWidth={1.5} />
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
        <GraduationCap className="h-6 w-6" strokeWidth={1.5} />
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
        <Headphones className="h-6 w-6" strokeWidth={1.5} />
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
        <Gauge className="h-6 w-6" strokeWidth={1.5} />
      ),
    },
  },
];

const fallbackVisual: CategoryVisual = {
  bg: "bg-slate/10",
  ring: "ring-slate/20",
  text: "text-slate-dark",
  icon: (
    <Building className="h-6 w-6" strokeWidth={1.5} />
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_24px_48px_-16px_rgba(44,57,71,0.14)] has-focus-visible:border-gold/40 has-focus-visible:ring-4 has-focus-visible:ring-gold/25">
      {/* نوار طلایی هنگام hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-6 right-0 w-0.75 origin-bottom scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100"
      />

      <Link href={`/jobs/${job.slug}`} className="flex-1 p-5 focus-visible:outline-none">
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
                <Building2 className="h-3.5 w-3.5 shrink-0" />
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
              <MapPin className="h-4 w-4 shrink-0" />

              {job.city}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 shrink-0" />
              {remoteTypeLabels[job.remoteType]}
            </span>

            {salary && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <CreditCard className="h-4 w-4 shrink-0 text-ink-muted" />

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
