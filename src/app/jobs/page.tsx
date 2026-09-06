import { prisma } from "@/lib/prisma";
import Link from "next/link";

const remoteLabels: Record<string, string> = {
  ONSITE: "حضوری",
  REMOTE: "دورکاری",
  HYBRID: "ترکیبی",
};

type Props = {
  searchParams: Promise<{ q?: string; city?: string; category?: string }>;
};

export default async function JobsPage({ searchParams }: Props) {
  const { q, city, category } = await searchParams;
  const hasFilters = Boolean(q || city || category);

  const jobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(category && { category }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">آگهی‌های شغلی</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {jobs.length} آگهی{hasFilters ? " مطابق جستجوی شما" : " فعال"}
      </p>

      {hasFilters && (
        <Link href="/jobs" className="mt-2 inline-block text-sm text-gold hover:underline">
          حذف فیلترها
        </Link>
      )}

      {jobs.length === 0 ? (
        <p className="mt-10 text-ink-muted">
          {hasFilters ? "آگهی‌ای مطابق این جستجو پیدا نشد." : "در حال حاضر آگهی‌ای موجود نیست."}
        </p>
      ) : (
        <ul className="mt-8 border-t-2 border-ink">
          {jobs.map((job, index) => (
            <li key={job.id} className="border-b border-line py-6">
              <Link href={`/jobs/${job.slug}`} className="group flex items-start justify-between gap-6">
                <div>
                  <span className="text-xs text-ink-muted">
                    آگهی #{String(index + 1).padStart(4, "0")}
                  </span>
                  <h2 className="mt-1 font-display text-lg font-bold text-ink group-hover:text-gold">
                    {job.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted">
                    {job.city} — {remoteLabels[job.remoteType]}
                  </p>
                </div>
                <span className="mt-1 shrink-0 border border-slate px-3 py-1 text-xs text-slate">
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