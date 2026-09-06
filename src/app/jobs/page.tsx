import { prisma } from "@/lib/prisma";
import Link from "next/link";
import JobCard from "@/components/JobCard";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ q?: string; city?: string; category?: string; page?: string }>;
};

function buildHref(params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.city) usp.set("city", params.city);
  if (params.category) usp.set("category", params.category);
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export default async function JobsPage({ searchParams }: Props) {
  const { q, city, category, page: pageRaw } = await searchParams;
  const hasFilters = Boolean(q || city || category);
  const page = Math.max(1, Number(pageRaw) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(city && { city: { contains: city, mode: "insensitive" as const } }),
    ...(category && { category }),
  };

  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { employer: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">آگهی‌های شغلی</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {totalCount} آگهی{hasFilters ? " مطابق جستجوی شما" : " فعال"}
      </p>

      {hasFilters && (
        <Link href="/jobs" className="mt-2 inline-block text-sm text-gold hover:underline">
          حذف فیلترها
        </Link>
      )}

      {jobs.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <svg className="h-10 w-10 text-ink-muted/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <p className="text-ink-muted">
            {hasFilters ? "آگهی‌ای مطابق این جستجو پیدا نشد." : "در حال حاضر آگهی‌ای موجود نیست."}
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-4">
            {jobs.map((job, index) => (
              <li key={job.id}>
                <JobCard job={job} index={(page - 1) * PAGE_SIZE + index} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
              {page > 1 ? (
                <Link href={buildHref({ q, city, category }, page - 1)} className="text-slate hover:underline">
                  ← صفحه‌ی قبل
                </Link>
              ) : (
                <span />
              )}

              <span className="text-ink-muted">
                صفحه‌ی {page} از {totalPages}
              </span>

              {page < totalPages ? (
                <Link href={buildHref({ q, city, category }, page + 1)} className="text-slate hover:underline">
                  صفحه‌ی بعد ←
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}