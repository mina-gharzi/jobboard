import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import ApplyForm from "./ApplyForm";
import JobCard from "@/components/JobCard";
import {
  remoteTypeLabels,
  formatSalary,
  formatRelativeTime,
} from "@/lib/format";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma/enums";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: {
      employer: { select: { name: true, image: true } },
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [job, session] = await Promise.all([
    getJob(slug),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!job || !canViewJob(job, session)) {
    return { title: "آگهی یافت نشد" };
  }

  return {
    title: `${job.title} — ${job.city} | Job Board`,
    description: job.description.slice(0, 150),
  };
}

function MetaPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-[13px] font-medium text-ink-muted shadow-[0_2px_10px_rgba(44,57,71,0.04)] backdrop-blur transition hover:border-gold/30 hover:bg-white">
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-ink-muted/70">
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      {isOwnerPreview && (
        <div className="mb-6 rounded-2xl border border-amber-300/50 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          این یک پیش‌نمایش است — این آگهی «{job.status === "DRAFT" ? "پیش‌نویس" : "بسته‌شده"}» است و برای عموم نمایش داده نمی‌شود.
        </div>
      )}

      {/* مسیر بازگشت */}
      <Link
        href="/jobs"
        className="group inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/60 transition group-hover:border-gold/30 group-hover:bg-gold/5">
          <svg
            className="h-4 w-4 -scale-x-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
        بازگشت به آگهی‌ها
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ستون اصلی */}
        <div className="min-w-0">
          {/* کارت هدر آگهی */}
          <div className="overflow-hidden rounded-3xl border border-line bg-white/70 shadow-[0_24px_64px_-32px_rgba(44,57,71,0.18)] backdrop-blur">
            <div className="h-20 bg-linear-to-l from-gold/20 via-gold/5 to-transparent" />

            <div className="relative px-5 pb-5 md:px-8 md:pb-7">
              <div className="flex items-start gap-4">
                {/* لوگوی شرکت */}
                <div className="relative -mt-8 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white text-xl font-bold text-slate-dark shadow-[0_12px_32px_-8px_rgba(44,57,71,0.25)]">
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

                <div className="min-w-0 pt-2">
                  <h1 className="font-display text-xl font-black leading-9 text-ink md:text-3xl">
                    {job.title}
                  </h1>

                  {job.employer?.name && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                      <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 9h4a2 2 0 0 1 2 2v10" />
                      </svg>

                      {job.employer.name}
                    </p>
                  )}
                </div>
              </div>

              {/* متادیتا */}
              <div className="mt-6 flex flex-wrap gap-2">
                {/* شهر */}
                <MetaPill
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-full w-full"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  }
                >
                  {job.city}
                </MetaPill>

                {/* نوع همکاری / ریموت */}
                <MetaPill
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-full w-full"
                    >
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  }
                >
                  {remoteTypeLabels[job.remoteType]}
                </MetaPill>

                {/* دسته‌بندی */}
                <MetaPill
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-full w-full"
                    >
                      <path d="M12 2 2 12l10 10 10-10z" />
                      <circle
                        cx="8"
                        cy="8"
                        r="1.2"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  }
                >
                  {job.category}
                </MetaPill>

                {/* حقوق */}
                {salary && (
                  <MetaPill
                    icon={
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-full w-full"
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    }
                  >
                    {salary}
                  </MetaPill>
                )}

                {/* زمان انتشار */}
                <MetaPill
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-full w-full"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  }
                >
                  {formatRelativeTime(job.createdAt)}
                </MetaPill>
              </div>
            </div>
          </div>

          {/* توضیحات */}
          <div className="mt-8 rounded-3xl border border-line bg-white/50 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-gold" />

              <h2 className="font-display text-lg font-bold text-ink">
                شرح موقعیت شغلی
              </h2>
            </div>

            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-9 text-ink/90">
              {job.description}
            </p>
          </div>

          {/* اپلای موبایل */}
          <div className="mt-8 lg:hidden">
            <ApplyBox
              session={session}
              jobId={job.id}
              existingApplication={existingApplication}
            />
          </div>

          {/* مشاغل مشابه */}
          {relatedJobs.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-1 rounded-full bg-gold" />

                  <h2 className="font-display text-lg font-bold text-ink md:text-xl">
                    مشاغل مشابه
                  </h2>
                </div>

                <span className="text-xs text-ink-muted">
                  {relatedJobs.length} آگهی مرتبط
                </span>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {relatedJobs.map((related) => (
                  <li key={related.id}>
                    <JobCard job={related} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* سایدبار اپلای — دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center gap-2 px-1 text-xs font-medium text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              موقعیت شغلی
            </div>

            <ApplyBox
              session={session}
              jobId={job.id}
              existingApplication={existingApplication}
            />
          </div>
        </aside>
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
    <div className="overflow-hidden rounded-3xl border border-line bg-white/70 shadow-[0_24px_64px_-36px_rgba(44,57,71,0.3)] backdrop-blur">
      {/* کاندیدا — اپلای جدید */}
      {isCandidate && !hasApplied && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-line bg-gold/5 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2 2 12l10 10 10-10z" />
                <path d="m8 12 3 3 5-6" />
              </svg>
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
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/40">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>

          <h3 className="mt-4 text-base font-bold text-ink">
            درخواستت ثبت شده است
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            وضعیت درخواستت را از همین‌جا دنبال کن.
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
              برای اپلای باید وارد شوی
            </h3>

            <p className="mt-2 text-sm leading-7 text-ink-muted">
              حساب کارجو بساز یا وارد شو تا در چند ثانیه برای این آگهی درخواست
              بفرستی.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_24px_-12px_rgba(44,57,71,0.25)]"
              >
                ورود به حساب
                <svg
                  className="h-4 w-4 -scale-x-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
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
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
            </svg>
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
