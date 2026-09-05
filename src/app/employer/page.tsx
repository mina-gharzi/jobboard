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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">آگهی‌های من</h1>
        <Link
          href="/employer/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          + ثبت آگهی جدید
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">هنوز آگهی‌ای ثبت نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li key={job.id} className="rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {job.city} · {job.remoteType === "ONSITE" ? "حضوری" : job.remoteType === "REMOTE" ? "دورکاری" : "ترکیبی"}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                {job._count.applications} درخواست دریافت‌شده
              </p>
              <Link
                href={`/employer/jobs/${job.id}/applicants`}
                className="mt-3 inline-block text-sm text-gray-900 underline"
              >
                مشاهده‌ی درخواست‌ها
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}