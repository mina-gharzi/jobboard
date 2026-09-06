import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateApplicationStatus } from "@/lib/actions/updateApplicationStatus";
import { formatRelativeTime } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار بررسی",
  REVIEWED: "بررسی‌شده",
  ACCEPTED: "پذیرفته‌شده",
  REJECTED: "رد‌شده",
};

const statusBadge: Record<string, string> = {
  PENDING: "badge badge-pending",
  REVIEWED: "badge badge-reviewed",
  ACCEPTED: "badge badge-accepted",
  REJECTED: "badge badge-rejected",
};

export default async function ApplicantsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const job = await prisma.job.findUnique({
    where: { id },
    include: { applications: { orderBy: { createdAt: "desc" } } },
  });

  if (!job || job.employerId !== session.user.id) {
    notFound();
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
        {job.applications.length} درخواست دریافت‌شده
      </p>

      {job.applications.length === 0 ? (
        <p className="mt-10 text-ink-muted">هنوز کسی برای این آگهی اپلای نکرده است.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {job.applications.map((app) => (
            <li key={app.id} className="rounded-2xl border border-line bg-white/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={statusBadge[app.status]}>{statusLabels[app.status]}</span>
                <span className="text-xs text-ink-muted">{formatRelativeTime(app.createdAt)}</span>
              </div>

              <p className="mt-3 text-sm text-ink">
                {app.coverLetter || <span className="text-ink-muted">بدون انگیزه‌نامه</span>}
              </p>

              <form
                action={updateApplicationStatus}
                className="mt-4 flex items-center gap-3 border-t border-line pt-4"
              >
                <input type="hidden" name="applicationId" value={app.id} />
                <select
                  name="status"
                  defaultValue={app.status}
                  className="input-field rounded-md border p-2 text-sm"
                >
                  <option value="PENDING">در انتظار بررسی</option>
                  <option value="REVIEWED">بررسی‌شده</option>
                  <option value="ACCEPTED">پذیرفته‌شده</option>
                  <option value="REJECTED">رد‌شده</option>
                </select>
                <button type="submit" className="btn-primary rounded-md px-4 py-2 text-sm">
                  ثبت تغییر وضعیت
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}