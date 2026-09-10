import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import ApplyForm from "./ApplyForm";
import JobCard from "@/components/JobCard";
import AvatarImage from "@/components/AvatarImage";
import {
  remoteTypeLabels,
  formatSalary,
  formatRelativeTime,
} from "@/lib/format";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import { SITE_URL } from "@/lib/site";
import { Activity, AlertTriangle, ArrowRight, Briefcase, Building2, Check, ChevronRight, Clock, CreditCard, FileText, Link as LinkIcon, LogIn, MapPin, ShieldCheck, Users } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: {
      employer: {
        select: {
          name: true,
          image: true,
          companyDescription: true,
          companyWebsite: true,
          companyTeamSize: true,
        },
      },
    },
  });
}

// آگهی برای عموم فقط وقتی PUBLISHED است قابل مشاهده است؛ کارفرمای
// صاحب آگهی استثنا است و باید بتواند پیش‌نمایش آگهی DRAFT/CLOSED خودش را ببیند.
function canViewJob(
  job: { status: string; employerId: string },
  session: Awaited<ReturnType<typeof auth.api.getSession>>
) {
  return job.status === "PUBLISHED" || session?.user.id === job.employerId;
}

// داده‌ی ساخت‌یافته‌ی schema.org/JobPosting — برای دیده‌شدن بهتر تو
// نتایج جستجوی گوگل (از جمله Google for Jobs).
function buildJobPostingJsonLd(job: {
  id: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  remoteType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: Date;
  employer: {
    name: string;
    image: string | null;
    companyWebsite: string | null;
  } | null;
}) {
  const isRemote = job.remoteType === "REMOTE";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer?.name ?? "نامشخص",
      ...(job.employer?.companyWebsite && { sameAs: job.employer.companyWebsite }),
      ...(job.employer?.image && { logo: job.employer.image }),
    },
  };

  if (isRemote) {
    jsonLd.jobLocationType = "TELECOMMUTE";
    jsonLd.applicantLocationRequirements = {
      "@type": "Country",
      name: "IR",
    };
  } else {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: "IR",
      },
    };
  }

  if (job.salaryMin != null || job.salaryMax != null) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "IRR",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin != null && { minValue: job.salaryMin }),
        ...(job.salaryMax != null && { maxValue: job.salaryMax }),
        unitText: "MONTH",
      },
    };
  }

  return jsonLd;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [job, session] = await Promise.all([
    getJob(slug),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!job || !canViewJob(job, session)) {
    return { title: "آگهی یافت نشد" };
  }

  const description = job.description.slice(0, 150);
  const url = `${SITE_URL}/jobs/${job.slug}`;

  return {
    title: `${job.title} — ${job.city} | Job Board`,
    description,
    alternates: { canonical: url },
    // آگهی‌های DRAFT/CLOSED فقط برای صاحبشون قابل دیدن‌ان (پیش‌نمایش)؛
    // نباید تو نتایج گوگل بیان.
    robots: job.status === "PUBLISHED" ? undefined : { index: false, follow: false },
    openGraph: {
      title: job.title,
      description,
      url,
      siteName: "Job Board",
      locale: "fa_IR",
      type: "website",
    },
  };
}

function MetaPill({
  icon,
  children,
  tint = "slate",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  tint?: "slate" | "gold";
}) {
  const tintClasses =
    tint === "gold"
      ? "border-gold/25 bg-gold/10 text-ink"
      : "border-slate/15 bg-slate/5 text-ink-muted";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium shadow-sm backdrop-blur transition hover:-translate-y-0.5 ${tintClasses}`}
    >
      <span
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center ${
          tint === "gold" ? "text-gold" : "text-slate-dark"
        }`}
      >
        {icon}
      </span>

      {children}
    </span>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!job || !canViewJob(job, session)) {
    notFound();
  }

  const isOwnerPreview = job.status !== "PUBLISHED";

  const existingApplication =
    session?.user.role === "CANDIDATE"
      ? await prisma.application.findUnique({
          where: {
            jobId_candidateId: {
              jobId: job.id,
              candidateId: session.user.id,
            },
          },
        })
      : null;

  const salary = formatSalary(job.salaryMin, job.salaryMax);

  const initial =
    job.employer?.name?.trim()?.[0] ?? job.category.trim()[0] ?? "؟";

  const relatedJobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      category: job.category,
      id: { not: job.id },
    },
    include: {
      employer: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const isCandidate = session?.user.role === "CANDIDATE";
  const hasApplied = isCandidate && existingApplication;
  const showMobileBar = session?.user.role !== "EMPLOYER";

  return (
    <div className="relative pb-[calc(8.5rem_+_env(safe-area-inset-bottom))] lg:pb-0">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {!isOwnerPreview && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              // escape می‌کنیم چون title/description از کاربر (کارفرما) میاد؛
              // بدون این escape، رشته‌ی «</script>» توی توضیحات می‌تونه تگ رو
              // زودتر ببنده و کد دلخواه رو تو صفحه inject کنه (Stored XSS).
              __html: JSON.stringify(buildJobPostingJsonLd(job)).replace(
                /</g,
                "\\u003c"
              ),
            }}
          />
        )}

        {isOwnerPreview && (
          <div className="mb-6 rounded-2xl border border-amber-300/50 bg-amber-50/80 px-5 py-3 text-sm text-amber-800 backdrop-blur">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/60">
                <AlertTriangle
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                />
              </span>
              این یک پیش‌نمایش است — این آگهی «{job.status === "DRAFT" ? "پیش‌نویس" : "بسته‌شده"}» است و برای عموم نمایش داده نمی‌شود.
            </span>
          </div>
        )}

        {/* مسیر بازگشت */}
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-2 rounded-xl text-sm font-medium text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur transition group-hover:border-gold/30 group-hover:bg-gold/5">
            <ChevronRight
              className="h-4 w-4 -scale-x-100"
            />
          </span>
          بازگشت به آگهی‌ها
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ستون اصلی */}
          <div className="min-w-0">
            {/* کارت هدر آگهی */}
            <div className="overflow-hidden rounded-[32px] border border-line bg-white/70 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur">
              {/* بنر گرادیانی */}
              <div className="relative h-24 overflow-hidden bg-linear-to-br from-gold/25 via-gold/8 to-slate/5 md:h-28">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
                  <div className="absolute -bottom-16 right-1/3 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                  <div className="absolute left-1/4 top-4 h-2 w-2 rounded-full bg-gold/60 animate-float" />
                  <div className="absolute right-1/4 bottom-5 h-1.5 w-1.5 rounded-full bg-slate/30 animate-float-delayed" />
                  <div className="absolute left-8 bottom-6 h-8 w-8 rotate-12 rounded-xl border border-gold/25 bg-white/40 backdrop-blur-sm" />
                </div>
              </div>

              <div className="relative px-5 pb-6 md:px-8 md:pb-8">
                <div className="flex items-start gap-4 md:gap-5">
                  {/* لوگوی شرکت */}
                  <div className="relative -mt-10 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-2xl font-bold text-slate-dark shadow-[0_16px_40px_-8px_rgba(44,57,71,0.3)] ring-4 ring-white/70 md:h-20 md:w-20">
                    <AvatarImage
                      src={job.employer?.image}
                      fallback={initial}
                      imageClassName="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 pt-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-display text-xl font-black leading-9 text-ink md:text-3xl">
                        {job.title}
                      </h1>
                      {job.category && (
                        <span className="rounded-full border border-slate/15 bg-slate/5 px-3 py-1 text-xs font-semibold text-slate-dark">
                          {job.category}
                        </span>
                      )}
                    </div>

                    {job.employer?.name && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
                        <Building2
                          className="h-4 w-4 shrink-0"
                        />

                        {job.employer.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* متادیتا */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {/* حقوق — هایلایت طلایی */}
                  {salary ? (
                    <MetaPill
                      tint="gold"
                      icon={
                    <CreditCard
                      className="h-full w-full"
                    />
                      }
                    >
                      <span className="font-bold">{salary}</span>
                    </MetaPill>
                  ) : (
                    <MetaPill
                      tint="gold"
                      icon={
                    <CreditCard
                      className="h-full w-full"
                    />
                      }
                    >
                      حقوق توافقی
                    </MetaPill>
                  )}

                  {/* شهر */}
                  <MetaPill
                    icon={
                    <MapPin
                      className="h-full w-full"
                    />
                    }
                  >
                    {job.city}
                  </MetaPill>

                  {/* نوع همکاری / ریموت */}
                  <MetaPill
                    icon={
                    <Briefcase
                      className="h-full w-full"
                    />
                    }
                  >
                    {remoteTypeLabels[job.remoteType]}
                  </MetaPill>

                  {/* زمان انتشار */}
                  <MetaPill
                    icon={
                    <Clock
                      className="h-full w-full"
                    />
                    }
                  >
                    {formatRelativeTime(job.createdAt)}
                  </MetaPill>
                </div>
              </div>
            </div>

            {/* توضیحات */}
            <div className="mt-8 rounded-[32px] border border-line bg-white/60 p-6 backdrop-blur md:p-9">
              <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <FileText
                      className="h-4.5 w-4.5"
                    />
                  </span>
                  <h2 className="font-display text-xl font-bold text-ink">
                    شرح موقعیت شغلی
                </h2>
              </div>

              <p className="mt-6 whitespace-pre-wrap text-[15px] leading-9 text-ink/90 md:text-base">
                {job.description}
              </p>
            </div>

            {/* اپلای موبایل */}
            <div id="apply" className="mt-8 scroll-mt-28 lg:hidden">
              <ApplyBox
                session={session}
                jobId={job.id}
                existingApplication={existingApplication}
              />
              <div className="mt-6">
                <CompanyInfoCard employer={job.employer} />
              </div>
            </div>

            {/* مشاغل مشابه */}
            {relatedJobs.length > 0 && (
              <section className="mt-14">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                      <Activity
                        className="h-4.5 w-4.5"
                      />
                    </span>
                    <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
                      مشاغل مشابه
                    </h2>
                  </div>

                  <span className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-semibold text-ink">
                    {relatedJobs.length} آگهی مرتبط
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {relatedJobs.map((related) => (
                    <JobCard key={related.id} job={related} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* سایدبار — دسکتاپ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <QuickFactsCard
                job={{
                  salary,
                  city: job.city,
                  remoteType: job.remoteType,
                  category: job.category,
                  createdAt: job.createdAt,
                }}
              />

              <ApplyBox
                session={session}
                jobId={job.id}
                existingApplication={existingApplication}
              />

              <CompanyInfoCard employer={job.employer} />
            </div>
          </aside>
        </div>
      </div>

      {/* نوار اپلای موبایل */}
      {showMobileBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-white/85 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)_+_0.75rem)] backdrop-blur-xl lg:hidden">
          <a
            href="#apply"
            className="flex items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-paper shadow-[0_16px_40px_-16px_rgba(44,57,71,0.5)] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
          >
            {hasApplied ? (
              <>
                <span className="inline-flex items-center gap-2">
                  <Check
                    className="h-4 w-4 text-emerald-400"
                    strokeWidth={2.5}
                  />
                  درخواست شما ثبت شده — وضعیت را مشاهده کنید
                </span>
              </>
            ) : session ? (
              <>
                <span>همین حالا درخواست بده</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold">
                  <ArrowRight
                    className="h-3.5 w-3.5 -scale-x-100"
                  />
                </span>
              </>
            ) : (
              <>
                <span>برای ارسال درخواست، ورود یا ثبت‌نام کنید</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold">
                  <ArrowRight
                    className="h-3.5 w-3.5 -scale-x-100"
                  />
                </span>
              </>
            )}
          </a>
        </div>
      )}
    </div>
  );
}

/* ───── کارت خلاصه شرایط اگهی (سایدبار) ───── */

function QuickFactsCard({
  job,
}: {
  job: {
    salary: string | null;
    city: string;
    remoteType: string;
    category: string;
    createdAt: Date;
  };
}) {
  const rows = {
    city: "شهر",
    remoteType: "نوع همکاری",
    category: "دسته‌بندی",
    createdAt: "زمان انتشار",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/70 shadow-[0_24px_64px_-36px_rgba(44,57,71,0.3)] backdrop-blur">
      <div className="border-b border-line bg-gold/5 px-5 py-4">
        <p className="text-sm font-bold text-ink">خلاصه‌ی شرایط</p>
      </div>

      <div className="p-5">
        {/* حقوق */}
        <div className="flex items-center justify-between rounded-2xl bg-gold/10 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted">
            <CreditCard
              className="h-4 w-4 text-gold"
            />
            حقوق
          </span>
          <span className="text-sm font-black text-ink">
            {job.salary ?? "توافقی"}
          </span>
        </div>

        {/* سایر جزئیات */}
        <div className="mt-3 flex flex-col divide-y divide-line/70 px-1">
          {Object.entries(rows).map(([key, label]) => {
            const value =
              key === "createdAt"
                ? formatRelativeTime(job.createdAt)
                : key === "remoteType"
                  ? remoteTypeLabels[job.remoteType as keyof typeof remoteTypeLabels]
                  : (job as unknown as Record<string, string>)[key];

            const icons: Record<string, React.ReactNode> = {
              city: (
                <MapPin
                  className="h-4 w-4"
                />
              ),
              remoteType: (
                <Briefcase
                  className="h-4 w-4"
                />
              ),
              category: (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 2 12l10 10 10-10z" />
                  <path d="M15.5 8.5a3 3 0 0 0-6 0c0 3 6 3 6 6a3 3 0 0 1-6 0" />
                </svg>
              ),
              createdAt: (
                <Clock
                  className="h-4 w-4"
                />
              ),
            };

            return (
              <div
                key={key}
                className="flex items-center justify-between py-2.5"
              >
                <span className="inline-flex items-center gap-2 text-[13px] text-ink-muted">
                  <span className="text-slate-dark/60">{icons[key]}</span>
                  {label}
                </span>
                <span className="text-[13px] font-semibold text-ink">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApplyBox({
  session,
  jobId,
  existingApplication,
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  jobId: string;
  existingApplication: { status: ApplicationStatus } | null;
}) {
  const isCandidate = session?.user.role === "CANDIDATE";
  const isEmployer = session?.user.role === "EMPLOYER";
  const hasApplied = isCandidate && existingApplication;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/80 shadow-[0_24px_64px_-40px_rgba(44,57,71,0.35)] backdrop-blur">
      {/* کاندیدا — اپلای جدید */}
      {isCandidate && !hasApplied && (
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-line bg-linear-to-l from-gold/10 via-gold/4 to-transparent px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-ink shadow-[0_8px_20px_-8px_rgba(194,165,109,0.8)]">
              <ShieldCheck
                className="h-4.5 w-4.5"
              />
            </span>

            <div>
              <p className="text-sm font-bold text-ink">
                درخواست خود را ثبت کن
              </p>

              <p className="text-xs text-ink-muted">
                رزومه‌ات مستقیماً برای کارفرما ارسال می‌شود
              </p>
            </div>
          </div>

          <div className="p-5">
            <ApplyForm jobId={jobId} />
          </div>
        </div>
      )}

      {/* کاندیدا — قبلاً اپلای کرده */}
      {isCandidate && hasApplied && (
        <div className="flex flex-col items-center px-5 py-9 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <Check
              className="h-6 w-6"
            />
          </span>

          <h3 className="mt-4 text-base font-bold text-ink">
            درخواست شما ثبت شده است
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            وضعیت درخواست خود را از همین‌جا پیگیری کنید.
          </p>

          <span
            className={`mt-4 ${applicationStatusBadge[existingApplication.status]}`}
          >
            {applicationStatusLabels[existingApplication.status]}
          </span>
        </div>
      )}

      {/* کاربر مهمان */}
      {!session && (
        <div className="p-5">
          <div className="rounded-2xl bg-linear-to-br from-gold/10 via-white to-transparent p-5">
            <h3 className="text-base font-bold text-ink">
              برای ارسال درخواست باید وارد شوید
            </h3>

            <p className="mt-2 text-sm leading-7 text-ink-muted">
              حساب کارجو بسازید یا وارد شوید تا در چند ثانیه برای این آگهی درخواست
              ارسال کنید.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_24px_-12px_rgba(44,57,71,0.25)]"
              >
                ورود به حساب
                <LogIn
                  className="h-4 w-4 -scale-x-100"
                />
              </Link>

              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_12px_24px_-12px_rgba(44,57,71,0.4)]"
              >
                ساخت حساب کارجو
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* کارفرما */}
      {isEmployer && (
        <div className="flex items-start gap-3 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate/10 text-slate-dark">
            <AlertTriangle
              className="h-4 w-4"
            />
          </span>

          <div>
            <p className="text-sm font-bold text-ink">حساب کارفرما</p>

            <p className="mt-1 text-xs leading-6 text-ink-muted">
              حساب‌های کارفرما نمی‌توانند برای آگهی‌ها اپلای کنند.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyInfoCard({
  employer,
}: {
  employer: {
    name: string;
    image: string | null;
    companyDescription: string | null;
    companyWebsite: string | null;
    companyTeamSize: string | null;
  } | null;
}) {
  if (
    !employer ||
    (!employer.companyDescription && !employer.companyWebsite && !employer.companyTeamSize)
  ) {
    return null;
  }

  const initial = employer.name?.trim()?.[0] ?? "؟";

  return (
    <div className="rounded-3xl border border-line bg-white/70 p-5 shadow-[0_24px_64px_-40px_rgba(44,57,71,0.3)] backdrop-blur md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white text-lg font-bold text-slate-dark">
          <AvatarImage
            src={employer.image}
            fallback={initial}
            imageClassName="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-ink">درباره‌ی {employer.name}</p>
          <p className="mt-0.5 text-xs text-ink-muted">شرکت کارفرما</p>
        </div>
      </div>

      {employer.companyDescription && (
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-ink/80">
          {employer.companyDescription}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4 text-sm text-ink-muted">
        {employer.companyTeamSize && (
          <span className="inline-flex items-center gap-2">
            <Users
              className="h-4 w-4 text-slate-dark/60"
              strokeWidth={1.8}
            />
            تیم {employer.companyTeamSize} نفره
          </span>
        )}
        {employer.companyWebsite && (
          <a
            href={employer.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-semibold text-slate underline-offset-4 hover:underline"
          >
            <LinkIcon
              className="h-4 w-4 text-slate-dark/60 group-hover:text-gold"
            />
            {employer.companyWebsite}
          </a>
        )}
      </div>
    </div>
  );
}