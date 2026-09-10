import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import ApplicationStatusForm from "./ApplicationStatusForm";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import Pagination from "@/components/Pagination";
import { Users, FileDown, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const STATUS_VALUES: ApplicationStatus[] = [
  "PENDING",
  "REVIEWED",
  "ACCEPTED",
  "REJECTED",
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function ApplicantsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const { page: pageRaw, status: statusRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  // فقط مقادیر معتبر enum رو به‌عنوان فیلتر قبول کن؛ هر چیز دیگه یعنی «همه»
  const status = STATUS_VALUES.includes(statusRaw as ApplicationStatus)
    ? (statusRaw as ApplicationStatus)
    : undefined;

  const where = { jobId: id, ...(status ? { status } : {}) };

  const [job, filteredCount, statusCounts] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          include: {
            candidate: {
              select: { name: true, email: true, phone: true, resumePdf: true, bio: true },
            },
          },
        },
      },
    }),
    prisma.application.count({ where }),
    prisma.application.groupBy({
      by: ["status"],
      where: { jobId: id },
      _count: true,
    }),
  ]);

  if (!job || job.employerId !== session.user.id) {
    notFound();
  }

  const totalCount = statusCounts.reduce((sum, s) => sum + s._count, 0);
  const countByStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  ) as Partial<Record<ApplicationStatus, number>>;

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  if (filteredCount > 0 && page > totalPages) {
    const suffix = status ? `&status=${status}` : "";
    redirect(`/employer/jobs/${id}/applicants?page=${totalPages}${suffix}`);
  }

  const chipClass = (active: boolean) =>
    active
      ? "rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper shadow-[0_12px_24px_-12px_rgba(44,57,71,0.5)]"
      : "rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-xs font-semibold text-ink-muted backdrop-blur transition hover:border-gold/40 hover:text-gold";

  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 md:px-10 md:pb-24 md:pt-16">
        <Link
          href="/employer"
          className="group inline-flex items-center gap-2 rounded-xl text-sm font-medium text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur transition group-hover:border-gold/30 group-hover:bg-gold/5">
            <ChevronRight className="h-4 w-4 -scale-x-100" />
          </span>
          بازگشت به آگهی‌های من
        </Link>

        <h1 className="mt-5 font-display text-2xl font-black text-ink md:text-3xl">
          درخواست‌های آگهی: {job.title}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          {formatNumber(totalCount)} درخواست دریافت‌شده
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/employer/jobs/${id}/applicants`} className={chipClass(!status)}>
            همه ({formatNumber(totalCount)})
          </Link>
          {STATUS_VALUES.map((s) => (
            <Link
              key={s}
              href={`/employer/jobs/${id}/applicants?status=${s}`}
              className={chipClass(status === s)}
            >
              {applicationStatusLabels[s]} ({formatNumber(countByStatus[s] ?? 0)})
            </Link>
          ))}
        </div>

        {job.applications.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-4xl border border-dashed border-ink/10 bg-white/50 px-6 py-14 text-center backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
              <Users className="h-7 w-7 text-gold" strokeWidth={1.8} />
            </div>
            <p className="font-bold text-ink">
              {status
                ? `درخواستی با وضعیت «${applicationStatusLabels[status]}» یافت نشد.`
                : "هنوز کسی برای این آگهی اپلای نکرده است."}
            </p>
          </div>
        ) : (
          <>
            <ul className="mt-8 flex flex-col gap-5">
              {job.applications.map((app) => (
                <li
                  key={app.id}
                  className="rounded-[28px] border border-ink/8 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:border-gold/20 hover:shadow-[0_20px_40px_-24px_rgba(44,57,71,0.25)] md:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={applicationStatusBadge[app.status]}>{applicationStatusLabels[app.status]}</span>
                    <span className="text-xs text-ink-muted">{formatRelativeTime(app.createdAt)}</span>
                  </div>

                  <div className="mt-3">
                    <p className="font-bold text-ink">
                      {app.candidate.name || "بدون نام"}
                    </p>
                    <p className="text-sm text-ink-muted">{app.candidate.email}</p>
                    {app.candidate.phone && (
                      <p className="mt-0.5 text-sm text-ink-muted" dir="ltr">
                        {app.candidate.phone}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {app.resumePdf && (
                        <a
                          href={app.resumePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                        >
                          <FileDown className="h-4 w-4" />
                          مشاهده‌ی رزومه‌ی ارسالی
                        </a>
                      )}
                      {app.candidate.resumePdf && (
                        <a
                          href={app.candidate.resumePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate/20 bg-slate/5 px-3 py-1.5 text-sm font-medium text-slate transition hover:border-slate/40 hover:bg-slate/10"
                        >
                          <FileDown className="h-4 w-4" />
                          رزومه‌ی پروفایل
                        </a>
                      )}
                    </div>
                    {app.candidate.bio && (
                      <p className="mt-3 text-sm leading-6 text-ink/80">{app.candidate.bio}</p>
                    )}
                  </div>

                  <p className="mt-4 rounded-2xl bg-ink/3 px-4 py-3 text-sm leading-6 text-ink">
                    {app.coverLetter || <span className="text-ink-muted">بدون انگیزه‌نامه</span>}
                  </p>

                  <div className="mt-4 border-t border-ink/8 pt-4">
                    <ApplicationStatusForm applicationId={app.id} status={app.status} />
                  </div>
                </li>
              ))}
            </ul>

            <Pagination
              page={page}
              totalPages={totalPages}
              href={(p) =>
                `/employer/jobs/${id}/applicants?page=${p}${status ? `&status=${status}` : ""}`
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
