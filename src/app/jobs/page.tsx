import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">آگهی‌های شغلی</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">در حال حاضر آگهی‌ای موجود نیست.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.slug}`}
                className="block rounded-lg border border-gray-200 p-5 transition hover:border-gray-400 hover:shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {job.city} · {job.remoteType === "ONSITE" ? "حضوری" : job.remoteType === "REMOTE" ? "دورکاری" : "ترکیبی"}
                </p>
                <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {job.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}