import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import JobCard from "@/components/JobCard";

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

export default async function CandidateDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/jobs");

  const applications = await prisma.application.findMany({
    where: { candidateId: session.user.id },
    include: {
      job: { include: { employer: { select: { name: true, image: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">درخواست‌های من</h1>

      {applications.length === 0 ? (
        <p className="text-ink-muted">هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((app) => (
            <li key={app.id}>
              <JobCard
                job={app.job}
                footer={
                  <span className={statusBadge[app.status]}>{statusLabels[app.status]}</span>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}