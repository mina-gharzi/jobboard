import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";

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
            <li key={job.id}>
              <JobCard
                job={job}
                footer={
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={statusBadge[job.status]}>{statusLabels[job.status]}</span>
                      <span className="text-sm text-ink-muted">
                        {job._count.applications} درخواست دریافت‌شده
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Link href={`/employer/jobs/${job.id}/applicants`} className="text-slate underline">
                        مشاهده‌ی درخواست‌ها
                      </Link>
                      <Link href={`/employer/jobs/${job.id}/edit`} className="text-slate underline">
                        ویرایش
                      </Link>
                    </div>
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}