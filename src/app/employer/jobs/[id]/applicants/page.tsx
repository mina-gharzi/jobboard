import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import ApplicationStatusForm from "./ApplicationStatusForm";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const PAGE_SIZE = 10;

const STATUS_VALUES: ApplicationStatus[] = [
  "PENDING",
  "REVIEWED",
  "ACCEPTED",
  "REJECTED",
];

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
              select: { name: true, email: true, phone: true, resumeUrl: true, bio: true },
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/employer" className="text-sm text-ink-muted hover:text-ink">
        ← بازگشت به آگهی‌های من
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">
        درخواست‌های آگهی: {job.title}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {totalCount} درخواست دریافت‌شده
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/employer/jobs/${id}/applicants`}
          className={
            !status
              ? "rounded-full bg-slate px-3 py-1.5 text-xs font-medium text-white"
              : "rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
          }
        >
          همه ({totalCount})
        </Link>
        {STATUS_VALUES.map((s) => (
          <Link
            key={s}
            href={`/employer/jobs/${id}/applicants?status=${s}`}
            className={
              status === s
                ? "rounded-full bg-slate px-3 py-1.5 text-xs font-medium text-white"
                : "rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
            }
          >
            {applicationStatusLabels[s]} ({countByStatus[s] ?? 0})
          </Link>
        ))}
      </div>

      {job.applications.length === 0 ? (
        <p className="mt-10 text-ink-muted">
          {status
            ? `درخواستی با وضعیت «${applicationStatusLabels[status]}» یافت نشد.`
            : "هنوز کسی برای این آگهی اپلای نکرده است."}
        </p>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-4">
            {job.applications.map((app) => (
              <li key={app.id} className="rounded-2xl border border-line bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={applicationStatusBadge[app.status]}>{applicationStatusLabels[app.status]}</span>
                  <span className="text-xs text-ink-muted">{formatRelativeTime(app.createdAt)}</span>
                </div>

                <div className="mt-3">
                  <p className="font-semibold text-ink">
                    {app.candidate.name || "بدون نام"}
                  </p>
                  <p className="text-sm text-ink-muted">{app.candidate.email}</p>
                  {app.candidate.phone && (
                    <p className="mt-0.5 text-sm text-ink-muted" dir="ltr">
                      {app.candidate.phone}
                    </p>
                  )}
                  {app.candidate.resumeUrl && (
                    <a
                      href={app.candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-slate underline"
                    >
                      مشاهده‌ی رزومه
                    </a>
                  )}
                  {app.candidate.bio && (
                    <p className="mt-2 text-sm leading-6 text-ink/80">{app.candidate.bio}</p>
                  )}
                </div>

                <p className="mt-3 text-sm text-ink">
                  {app.coverLetter || <span className="text-ink-muted">بدون انگیزه‌نامه</span>}
                </p>

                <ApplicationStatusForm applicationId={app.id} status={app.status} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
              {page > 1 ? (
                <Link
                  href={`/employer/jobs/${id}/applicants?page=${page - 1}${status ? `&status=${status}` : ""}`}
                  className="text-slate hover:underline"
                >
                  ← صفحه‌ی قبل
                </Link>
              ) : (
                <span />
              )}

              <span className="text-ink-muted">
                صفحه‌ی {page} از {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/employer/jobs/${id}/applicants?page=${page + 1}${status ? `&status=${status}` : ""}`}
                  className="text-slate hover:underline"
                >
                  صفحه‌ی بعد ←
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}