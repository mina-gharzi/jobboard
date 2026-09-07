import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import ApplicationStatusForm from "./ApplicationStatusForm";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";

const PAGE_SIZE = 10;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ApplicantsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);

  const [job, totalCount] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        },
      },
    }),
    prisma.application.count({ where: { jobId: id } }),
  ]);

  if (!job || job.employerId !== session.user.id) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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

      {job.applications.length === 0 ? (
        <p className="mt-10 text-ink-muted">هنوز کسی برای این آگهی اپلای نکرده است.</p>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-4">
            {job.applications.map((app) => (
              <li key={app.id} className="rounded-2xl border border-line bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={applicationStatusBadge[app.status]}>{applicationStatusLabels[app.status]}</span>
                  <span className="text-xs text-ink-muted">{formatRelativeTime(app.createdAt)}</span>
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
                  href={`/employer/jobs/${id}/applicants?page=${page - 1}`}
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
                  href={`/employer/jobs/${id}/applicants?page=${page + 1}`}
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
