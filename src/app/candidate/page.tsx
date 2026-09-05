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

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">درخواست‌های من</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((app) => (
            <li key={app.id} className="rounded-lg border border-gray-200 p-5">
              <Link href={`/jobs/${app.job.slug}`} className="text-lg font-semibold text-gray-900 hover:underline">
                {app.job.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500">
                {app.job.city} · {app.job.remoteType === "ONSITE" ? "حضوری" : app.job.remoteType === "REMOTE" ? "دورکاری" : "ترکیبی"}
              </p>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${statusColors[app.status]}`}>
                {statusLabels[app.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}