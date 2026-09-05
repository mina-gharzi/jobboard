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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>درخواست‌های من</h1>

      {applications.length === 0 ? (
        <p>هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {applications.map((app) => (
            <li key={app.id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
              <Link href={`/jobs/${app.job.slug}`}>
                <h3>{app.job.title}</h3>
              </Link>
              <p>{app.job.city} · {app.job.remoteType}</p>
              <p>وضعیت: <strong>{statusLabels[app.status]}</strong></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}