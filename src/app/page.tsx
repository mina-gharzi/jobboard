import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  const [
    jobCount,
    employerGroups,
    candidateCount,
    categories,
    recentJobs,
  ] = await Promise.all([
    prisma.job.count({ where: { status: "PUBLISHED" } }),
    prisma.job.groupBy({
      by: ["employerId"],
      where: { status: "PUBLISHED" },
    }),
    prisma.user.count({ where: { role: "CANDIDATE" } }),
    prisma.job.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
      take: 5,
    }),
    prisma.job.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { id: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        remoteType: true,
        salaryMin: true,
        salaryMax: true,
        employer: {
          select: { name: true },
        },
      },
    }),
  ]);

  const employerCount = employerGroups.length;

  return (
    <main className="overflow-hidden">
      {/* ───── Hero ───── */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[380px] w-[380px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-24 md:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-semibold text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              مسیر شغلی جدیدت از اینجا شروع می‌شود
            </span>

            <h1 className="mt-8 text-4xl font-black leading-[1.3] tracking-tight text-ink sm:text-5xl md:text-7xl">
              فرصت‌ها را پیدا کن.
              <span className="mt-2 block bg-gradient-to-l from-gold via-gold to-gold/50 bg-clip-text text-transparent">
                آینده را بساز.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-ink-muted md:text-lg">
              شغل مناسب خودت را پیدا کن، یا استعدادهایی را پیدا کن که تیم
              بعدی‌ات به آن‌ها نیاز دارد.
            </p>

            {/* ── Search ── */}
            <form
              action="/jobs"
              method="GET"
              className="mt-10 rounded-[28px] border border-ink/10 bg-paper/70 p-2 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.15)] backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_0.9fr_auto]">
                <label className="flex min-h-14 cursor-text items-center gap-3 rounded-2xl border border-transparent bg-transparent px-4 transition focus-within:border-gold/30 focus-within:bg-paper focus-within:ring-4 focus-within:ring-gold/10">
                  <svg className="h-5 w-5 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    placeholder="عنوان شغل، مهارت یا کلمه کلیدی"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </label>

                <label className="flex min-h-14 cursor-text items-center gap-3 rounded-2xl border border-transparent bg-transparent px-4 transition focus-within:border-gold/30 focus-within:bg-paper focus-within:ring-4 focus-within:ring-gold/10">
                  <svg className="h-5 w-5 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    placeholder="شهر"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="flex min-h-14 items-center justify-center rounded-2xl bg-ink px-8 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90"
                >
                  جستجوی شغل
                </button>
              </div>
            </form>

            {/* ── Category chips ── */}
            {categories.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-ink-muted">دسته‌های موجود:</span>
                {categories.map(({ category }) => (
                  <Link
                    key={category}
                    href={`/jobs?category=${encodeURIComponent(category)}`}
                    className="rounded-full border border-ink/10 bg-paper/60 px-3 py-1.5 text-ink-muted transition hover:border-gold hover:text-ink"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* ── Stats ── */}
            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 overflow-hidden rounded-[28px] border border-ink/10 bg-paper/60 py-6 shadow-sm backdrop-blur">
              <div className="text-center">
                <p className="text-2xl font-black text-ink md:text-3xl">
                  {formatNumber(jobCount)}
                </p>
                <p className="mt-1 text-xs text-ink-muted md:text-sm">
                  فرصت شغلی فعال
                </p>
              </div>
              <div className="border-x border-ink/10 text-center">
                <p className="text-2xl font-black text-ink md:text-3xl">
                  {formatNumber(employerCount)}
                </p>
                <p className="mt-1 text-xs text-ink-muted md:text-sm">
                  شرکت فعال
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-ink md:text-3xl">
                  {formatNumber(candidateCount)}
                </p>
                <p className="mt-1 text-xs text-ink-muted md:text-sm">کارجو</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Latest Jobs ───── */}
      <section className="border-t border-ink/5 bg-ink/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gold">جدیدترین فرصت‌ها</p>
              <h2 className="mt-2 text-2xl font-black text-ink md:text-3xl">
                آخرین آگهی‌های استخدام
              </h2>
            </div>
            <Link
              href="/jobs"
              className="rounded-full border border-ink/10 bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              مشاهده همه آگهی‌ها
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.15)]"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink/[0.04] text-base font-black text-ink">
                      {(job.employer?.name ?? "ک")[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-ink transition group-hover:text-gold">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {job.employer?.name ?? "شرکت"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <span className="rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-ink">
                      {job.category}
                    </span>
                    <span className="rounded-full bg-ink/[0.04] px-3 py-1.5 text-xs text-ink-muted">
                      {job.city || "تهران"}
                    </span>
                    {job.remoteType && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700">
                        {job.remoteType}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 border-t border-ink/5 pt-4">
                    {job.salaryMin || job.salaryMax ? (
                      <p className="text-sm font-semibold text-ink">
                        {job.salaryMin && job.salaryMax
                          ? `${formatNumber(job.salaryMin)} تا ${formatNumber(job.salaryMax)} تومان`
                          : job.salaryMin
                            ? `از ${formatNumber(job.salaryMin)} تومان`
                            : `تا ${formatNumber(job.salaryMax!)} تومان`}
                      </p>
                    ) : (
                      <p className="text-sm text-ink-muted">حقوق توافقی</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/10 bg-paper p-14 text-center text-ink-muted">
              هنوز فرصت شغلی منتشر نشده است.
            </div>
          )}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="relative isolate overflow-hidden rounded-[40px] bg-ink px-6 py-16 text-center md:px-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold text-gold">جابینو برای همه</p>
              <h2 className="mt-4 text-3xl font-black leading-[1.4] text-paper md:text-5xl">
                چه دنبال کار باشی،
                <br />
                چه دنبال نیروی جدید،
                <br />
                <span className="text-gold">همه‌چیز از اینجا شروع می‌شود.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-paper/60 md:text-base">
                همین حالا اولین قدم را بردار؛ بقیه‌اش را به ما بسپار.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/jobs"
                  className="rounded-2xl bg-paper px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5"
                >
                  پیدا کردن شغل
                </Link>

                {!session && (
                  <Link
                    href="/register"
                    className="rounded-2xl bg-gold px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    شروع رایگان
                  </Link>
                )}
                {session?.user.role === "EMPLOYER" && (
                  <Link
                    href="/employer/new"
                    className="rounded-2xl bg-gold px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    ثبت آگهی جدید
                  </Link>
                )}
                {session?.user.role === "CANDIDATE" && (
                  <Link
                    href="/candidate"
                    className="rounded-2xl bg-gold px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    درخواست‌های من
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
