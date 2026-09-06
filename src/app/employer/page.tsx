import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  PUBLISHED: "منتشرشده",
  CLOSED: "بسته‌شده",
};

const statusBadge: Record<string, string> = {
  DRAFT: "badge badge-neutral",
  PUBLISHED: "badge badge-accepted",
  CLOSED: "badge badge-rejected",
};

export default async function EmployerDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const jobs = await prisma.job.findMany({
    where: { employerId: session.user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">آگهی‌های من</h1>
        <Link href="/employer/new" className="btn-primary rounded-md px-4 py-2 text-sm">
          + ثبت آگهی جدید
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-ink-muted">هنوز آگهی‌ای ثبت نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li key={job.id} className="rounded-lg border border-line p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{job.title}</h3>
                <span className={statusBadge[job.status]}>{statusLabels[job.status]}</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {job.city} · {job.remoteType === "ONSITE" ? "حضوری" : job.remoteType === "REMOTE" ? "دورکاری" : "ترکیبی"}
              </p>
              <p className="mt-2 text-sm text-ink">
                {job._count.applications} درخواست دریافت‌شده
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <Link href={`/employer/jobs/${job.id}/applicants`} className="text-slate underline">
                  مشاهده‌ی درخواست‌ها
                </Link>
                <Link href={`/employer/jobs/${job.id}/edit`} className="text-slate underline">
                  ویرایش / تغییر وضعیت
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}