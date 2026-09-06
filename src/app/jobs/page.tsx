import { prisma } from "@/lib/prisma";
import Link from "next/link";
import JobCard from "@/components/JobCard";

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
    include: {
      employer: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">
        آگهی‌های شغلی
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {jobs.length} آگهی{hasFilters ? " مطابق جستجوی شما" : " فعال"}
      </p>

      {hasFilters && (
        <Link
          href="/jobs"
          className="mt-2 inline-block text-sm text-gold hover:underline"
        >
          حذف فیلترها
        </Link>
      )}

      {jobs.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <svg
            className="h-10 w-10 text-ink-muted/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <p className="text-ink-muted">
            {hasFilters
              ? "آگهی‌ای مطابق این جستجو پیدا نشد."
              : "در حال حاضر آگهی‌ای موجود نیست."}
          </p>
          {hasFilters && (
            <Link href="/jobs" className="text-sm text-gold hover:underline">
              حذف فیلترها و مشاهده همه آگهی‌ها
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {jobs.map((job, index) => (
            <li key={job.id}>
              <JobCard job={job} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
