import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60; // هر ۶۰ ثانیه یک‌بار تازه بشه (ISR)

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  if (jobs.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto" }}>
        <h1>آگهی‌های شغلی</h1>
        <p>در حال حاضر آگهی‌ای موجود نیست.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>آگهی‌های شغلی</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li key={job.id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
            <Link href={`/jobs/${job.slug}`}>
              <h2>{job.title}</h2>
            </Link>
            <p>{job.city} · {job.remoteType}</p>
            <p>{job.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}