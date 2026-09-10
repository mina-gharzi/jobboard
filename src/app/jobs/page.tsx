import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobCard from "@/components/JobCard";
import { buildSearchTerms } from "@/lib/search";
import Pagination from "@/components/Pagination";
import { MapPin, PlusSquare, Search, X } from "lucide-react";

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

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-10 md:pb-24 md:pt-20">
        {/* ── header ── */}
        <header className="mb-6 flex items-center justify-between gap-4 md:mb-12">
          <div>
            <h1 className="text-xl font-black text-ink md:text-4xl">
              {hasFilters ? "نتیجه‌ی جستجوی شما" : "همه آگهی‌های استخدام"}
            </h1>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-gold md:text-sm">
              <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
              فرصت‌های شغلی
            </span>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-bold text-ink md:gap-2 md:px-4 md:py-2 md:text-sm">
            <PlusSquare className="h-3.5 w-3.5 text-gold md:h-4 md:w-4" />
            {formatNumber(totalCount)}
            <span className="hidden sm:inline">آگهی فعال</span>
          </span>
        </header>

        {hasFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 md:mb-0 md:gap-2">
            {filterChips.map(
              (chip) =>
                chip && (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 py-1 pl-2.5 pr-3 text-[11px] font-semibold text-ink shadow-sm backdrop-blur-md transition hover:border-gold/40 hover:bg-gold/5 focus-visible:outline-none focus-visible:border-gold/40 focus-visible:ring-4 focus-visible:ring-gold/20 md:gap-2 md:py-1.5 md:pl-3 md:pr-4 md:text-xs"
                  >
                    {chip.label}
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink/10 text-ink-muted transition-colors group-hover:bg-gold/20 group-hover:text-gold md:h-4 md:w-4">
                      <X className="h-2 w-2 md:h-2.5 md:w-2.5" strokeWidth={2.5} />
                    </span>
                  </Link>
                )
            )}
            <Link
              href="/jobs"
              className="text-[11px] font-semibold text-ink-muted transition-colors hover:text-gold focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-gold/20 md:text-xs"
            >
              حذف همه
            </Link>
          </div>
        )}

        {/* ── search bar ── */}
        <div className="mb-8 rounded-3xl border border-white/50 bg-white/70 p-2 shadow-[0_24px_80px_-24px_rgba(44,57,71,0.2)] backdrop-blur-2xl md:mb-10 md:rounded-4xl md:p-2.5">
          <form action="/jobs" method="GET">
            {/* mobile: two compact rows */}
            <div className="flex flex-col gap-1.5 md:hidden">
              <label className="group flex h-10 items-center gap-2 rounded-2xl border border-transparent bg-transparent px-3 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                <Search className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="عنوان شغل یا مهارت..."
                  aria-label="عنوان شغل یا مهارت"
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none"
                />
              </label>

              <div className="flex gap-1.5">
                <label className="group flex h-10 flex-1 items-center gap-2 rounded-2xl border border-transparent bg-transparent px-3 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                  <MapPin className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                  <input
                    type="text"
                    name="city"
                    defaultValue={city ?? ""}
                    placeholder="شهر"
                    aria-label="شهر"
                    className="w-full bg-transparent text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none"
                  />
                </label>

                {category && <input type="hidden" name="category" value={category} />}

                <button
                  type="submit"
                  className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-ink px-4 text-xs font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0"
                >
                  <Search className="h-3.5 w-3.5" />
                  جستجو
                </button>
              </div>
            </div>

            {/* desktop: three-column row */}
            <div className="hidden grid-cols-[1fr_0.85fr_auto] gap-2 md:grid">
              <label className="group flex min-h-14 cursor-text items-center gap-3 rounded-3xl border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                <Search className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="عنوان شغل، مهارت یا کلمه کلیدی"
                  aria-label="عنوان شغل، مهارت یا کلمه کلیدی"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
                />
              </label>

              <label className="group flex min-h-14 cursor-text items-center gap-3 rounded-3xl border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                <MapPin className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                <input
                  type="text"
                  name="city"
                  defaultValue={city ?? ""}
                  placeholder="شهر"
                  aria-label="شهر"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
                />
              </label>

              {category && <input type="hidden" name="category" value={category} />}

              <button
                type="submit"
                className="group flex min-h-14 items-center justify-center gap-2 rounded-3xl bg-ink px-8 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_16px_32px_-12px_rgba(44,57,71,0.5)] active:translate-y-0"
              >
                <Search className="h-4 w-4" />
                جستجو
              </button>
            </div>
          </form>
        </div>

        {/* ── results ── */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-4xl border border-dashed border-ink/10 bg-white/50 px-6 py-14 text-center backdrop-blur-sm md:px-8 md:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <Search className="h-8 w-8 text-gold" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-bold text-ink">
                {hasFilters ? "آگهی‌ای مطابق این جستجو پیدا نشد." : "در حال حاضر آگهی‌ای موجود نیست."}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {hasFilters
                  ? "فیلترها را ساده‌تر کنید یا کلمات دیگری امتحان کنید."
                  : "اولین آگهی‌ها به‌زودی منتشر می‌شوند؛ لطفاً بعداً مجدداً مراجعه کنید."}
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
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={(page - 1) * PAGE_SIZE + index} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              href={(p) => buildHref({ q, city, category }, p)}
              pageItems={pageItems}
              formatNumber={formatNumber}
            />
          </>
        )}
      </div>
    </div>
  );
}
