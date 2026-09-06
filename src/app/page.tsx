import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  const [jobCount, employerGroups, candidateCount, categories] =
    await Promise.all([
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
    ]);

  const employerCount = employerGroups.length;

  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-105 w-105 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -left-40 top-1/2 h-90 w-90 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-sm font-medium text-ink-muted">
              مسیر شغلی جدیدت از اینجا شروع می‌شود
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-[1.3] tracking-tight text-ink md:text-7xl">
              فرصت‌ها را پیدا کن.
              <br />
              <span className="text-gold">آینده را بساز.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">
              شغل مناسب خودت را پیدا کن، یا استعدادهایی را پیدا کن که تیم
              بعدی‌ات به آن‌ها نیاز دارد.
            </p>
          </div>

          {/* سرچ‌باکس واقعی — به /jobs با پارامتر GET ارسال می‌شود */}
          <form
            action="/jobs"
            method="GET"
            className="mt-12 max-w-5xl rounded-2xl border border-ink/10 bg-paper/80 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur"
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex min-h-14 flex-1 items-center rounded-xl border border-ink/10 bg-transparent px-4 transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/10">
                <svg
                  className="ml-3 h-5 w-5 shrink-0 text-ink-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  name="q"
                  placeholder="عنوان شغل، مهارت یا کلمه کلیدی"
                  className="w-full text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
              </div>

              <div className="flex min-h-14 flex-1 items-center rounded-xl border border-ink/10 bg-paper px-4">
                <svg
                  className="ml-3 h-5 w-5 shrink-0 text-ink-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <input
                  type="text"
                  name="city"
                  placeholder="شهر"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex min-h-14 items-center justify-center rounded-xl bg-ink px-8 text-sm font-semibold text-paper transition hover:bg-ink/90"
              >
                جستجوی شغل
              </button>
            </div>
          </form>

          {categories.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-muted">دسته‌های موجود:</span>
              {categories.map(({ category }) => (
                <Link
                  key={category}
                  href={`/jobs?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-ink/10 px-3 py-1.5 text-ink-muted transition hover:border-gold hover:text-ink"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16 grid max-w-3xl grid-cols-3 border-y border-ink/10 py-7">
            <div className="text-center">
              <p className="text-2xl font-bold text-ink md:text-3xl">
                {jobCount}
              </p>
              <p className="mt-1 text-xs text-ink-muted md:text-sm">
                فرصت شغلی فعال
              </p>
            </div>
            <div className="border-x border-ink/10 text-center">
              <p className="text-2xl font-bold text-ink md:text-3xl">
                {employerCount}
              </p>
              <p className="mt-1 text-xs text-ink-muted md:text-sm">
                شرکت فعال
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ink md:text-3xl">
                {candidateCount}
              </p>
              <p className="mt-1 text-xs text-ink-muted md:text-sm">کارجو</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-medium text-gold">جابینو برای همه</p>
              <h2 className="mt-3 text-2xl font-bold leading-10 text-paper md:text-3xl">
                چه دنبال کار باشی،
                <br />
                چه دنبال نیروی جدید.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/jobs"
                className="rounded-xl bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
              >
                پیدا کردن شغل
              </Link>

              {!session && (
                <Link
                  href="/register"
                  className="rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                >
                  شروع رایگان
                </Link>
              )}
              {session?.user.role === "EMPLOYER" && (
                <Link
                  href="/employer/new"
                  className="rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                >
                  ثبت آگهی جدید
                </Link>
              )}
              {session?.user.role === "CANDIDATE" && (
                <Link
                  href="/candidate"
                  className="rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-gold-hover"
                >
                  درخواست‌های من
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
