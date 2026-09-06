import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CandidateDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/jobs");
  }

  const applications = await prisma.application.findMany({
    where: { candidateId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  const statusLabels: Record<string, string> = {
    PENDING: "در انتظار بررسی",
    REVIEWED: "بررسی‌شده",
    ACCEPTED: "پذیرفته‌شده",
    REJECTED: "رد‌شده",
  };

  const statusBadgeClasses: Record<string, string> = {
    PENDING: "badge badge-pending",
    REVIEWED: "badge badge-reviewed",
    ACCEPTED: "badge badge-accepted",
    REJECTED: "badge badge-rejected",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">درخواست‌های من</h1>

      {applications.length === 0 ? (
        <p className="text-ink-muted">هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((app) => (
            <li key={app.id} className="rounded-lg border border-line p-5">
              <Link href={`/jobs/${app.job.slug}`} className="font-display text-lg font-semibold text-ink hover:underline">
                {app.job.title}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                {app.job.city} · {app.job.remoteType === "ONSITE" ? "حضوری" : app.job.remoteType === "REMOTE" ? "دورکاری" : "ترکیبی"}
              </p>
              <span className={`mt-3 ${statusBadgeClasses[app.status]}`}>
                {statusLabels[app.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}