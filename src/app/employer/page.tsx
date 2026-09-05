import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EmployerDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/jobs");
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: session.user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>آگهی‌های من</h1>
      <Link href="/employer/new">+ ثبت آگهی جدید</Link>

      {jobs.length === 0 ? (
        <p>هنوز آگهی‌ای ثبت نکرده‌اید.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
              <h3>{job.title}</h3>
              <p>{job.city} · {job.remoteType}</p>
              <p>{job._count.applications} درخواست دریافت‌شده</p>
              <Link href={`/employer/jobs/${job.id}/applicants`}>مشاهده‌ی درخواست‌ها</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}