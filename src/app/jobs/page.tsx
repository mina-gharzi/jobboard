import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobCard from "@/components/JobCard";
import { buildSearchTerms } from "@/lib/search";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ q?: string; city?: string; category?: string; page?: string }>;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

function buildHref(params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.city) usp.set("city", params.city);
  if (params.category) usp.set("category", params.category);
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

type PageItem = number | "...";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const candidates = new Set([
    1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  const sorted = [...candidates]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push("...");
    items.push(p);
    prev = p;
  }
  return items;
}

type FilterChip = { label: string; href: string } | null;

export default async function JobsPage({ searchParams }: Props) {
  const { q, city, category, page: pageRaw } = await searchParams;
  const hasFilters = Boolean(q || city || category);
  const page = Math.max(1, Number(pageRaw) || 1);

  const searchTerms = q ? buildSearchTerms(q) : [];

  const where = {
    status: "PUBLISHED" as const,
    ...(searchTerms.length && {
      OR: searchTerms.flatMap((term) => [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
      ]),
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

  // اگه صفحه‌ی درخواستی بیشتر از تعداد صفحات موجوده (مثلاً کاربر URL رو
  // دستی دستکاری کرده یا از یه لینک قدیمی اومده)، به آخرین صفحه‌ی معتبر
  // redirect می‌کنیم؛ وگرنه یه صفحه‌ی خالی و گمراه‌کننده («آگهی‌ای پیدا
  // نشد») نشون داده می‌شه در حالی که واقعاً نتیجه‌ای برای فیلترها هست.
  if (totalCount > 0 && page > totalPages) {
    redirect(buildHref({ q, city, category }, totalPages));
  }

  const filterChips: FilterChip[] = [
    q ? { label: `جستجو: «${q}»`, href: buildHref({ city, category }, page) } : null,
    city ? { label: `شهر: ${city}`, href: buildHref({ q, category }, page) } : null,
    category ? { label: `دسته: ${category}`, href: buildHref({ q, city }, page) } : null,
  ];

  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-14 md:px-10 md:pt-20">
        {/* ── header ── */}
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gold">
              <span className="h-px w-8 rounded-full bg-gold/40" />
              فرصت‌های شغلی
            </span>
            <h1 className="mt-3 text-3xl font-black text-ink md:text-4xl">
              {hasFilters ? "نتیجه‌ی جستجوی تو" : "همه آگهی‌های استخدام"}
            </h1>

            {hasFilters ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {filterChips.map(
                  (chip) =>
                    chip && (
                      <Link
                        key={chip.href}
                        href={chip.href}
                        className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 py-1.5 pl-3 pr-4 text-xs font-semibold text-ink shadow-sm backdrop-blur-md transition hover:border-gold/40 hover:bg-gold/5"
                      >
                        {chip.label}
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-ink-muted transition-colors group-hover:bg-gold/20 group-hover:text-gold">
                          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </span>
                      </Link>
                    )
                )}
                <span className="h-6 w-px bg-ink/10" />
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-ink-muted transition-colors hover:text-gold"
                >
                  حذف همه فیلترها
                </Link>
              </div>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-sm font-bold text-ink">
            <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="M9 12h6M12 9v6" />
            </svg>
            {formatNumber(totalCount)} آگهی فعال
          </span>
        </header>

        {/* ── results ── */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[32px] border border-dashed border-ink/10 bg-white/50 px-8 py-20 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <svg className="h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-ink">
                {hasFilters ? "آگهی‌ای مطابق این جستجو پیدا نشد." : "در حال حاضر آگهی‌ای موجود نیست."}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {hasFilters
                  ? "سعی کن فیلترها رو ساده‌تر کنی یا کلمات دیگری امتحان کنی."
                  : "اولین آگهی‌ها به‌زودی منتشر می‌شوند؛ دوباره سر بزن."}
              </p>
            </div>
            {hasFilters && (
              <Link
                href="/jobs"
                className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90"
              >
                حذف همه فیلترها
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={(page - 1) * PAGE_SIZE + index} />
              ))}
            </div>

            {/* ── pagination ── */}
            {totalPages > 1 && (
              <nav
                aria-label="صفحه‌بندی"
                className="mt-14 flex flex-wrap items-center justify-center gap-2"
              >
                {page > 1 ? (
                  <Link
                    href={buildHref({ q, city, category }, page - 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/5 text-ink-muted/30" />
                )}

                {pageItems.map((item, i) =>
                  item === "..." ? (
                    <span key={`gap-${i}`} className="px-1 text-sm text-ink-muted">
                      …
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={buildHref({ q, city, category }, item)}
                      aria-current={item === page ? "page" : undefined}
                      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                        item === page
                          ? "bg-ink text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)]"
                          : "border border-ink/10 bg-white/60 text-ink hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)]"
                      }`}
                    >
                      {formatNumber(item)}
                    </Link>
                  )
                )}

                {page < totalPages ? (
                  <Link
                    href={buildHref({ q, city, category }, page + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/5 text-ink-muted/30" />
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}