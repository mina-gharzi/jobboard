import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import JobCard from "@/components/JobCard";
import { JOB_CATEGORIES } from "@/lib/categories";
import { Building2, Briefcase, Check, ChevronLeft, Clock, MapPin, PlusSquare, Search, Users } from "lucide-react";

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
      // به‌جای نمایش هر مقداری که تو ستون category هست (که ممکنه شامل
      // داده‌ی قدیمی/دستی قبل از کنترل‌شدن این فیلد باشه)، فقط دسته‌های
      // معتبرِ همون لیستی که تو فرم ثبت آگهی استفاده می‌شه رو می‌گیریم —
      // این یعنی چیزی که تو Home نشون داده می‌شه، همیشه با label های
      // فارسی و ترتیب ثابتِ بقیه‌ی پروژه یکدست می‌مونه.
      where: { status: "PUBLISHED", category: { in: [...JOB_CATEGORIES] } },
      select: { category: true },
      distinct: ["category"],
    }),
    prisma.job.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        city: true,
        remoteType: true,
        salaryMin: true,
        salaryMax: true,
        createdAt: true,
        employer: {
          select: { name: true, image: true },
        },
      },
    }),
  ]);

  const employerCount = employerGroups.length;

  // خروجی Prisma به ترتیب ثابتی مرتب نیست؛ همون ترتیبی که تو select
  // فرم ثبت آگهی هست رو اینجا هم رعایت می‌کنیم تا چیپ‌ها همیشه یک شکل
  // ظاهر بشن (مثلاً همیشه «فرانت‌اند» قبل از «بک‌اند»).
  const sortedCategories = categories
    .map((c) => c.category)
    .sort(
      (a, b) =>
        (JOB_CATEGORIES as readonly string[]).indexOf(a) -
        (JOB_CATEGORIES as readonly string[]).indexOf(b)
    )
    .slice(0, 5);

  const stats = [
    {
      label: "فرصت شغلی فعال",
      value: formatNumber(jobCount),
      icon: <PlusSquare className="h-5 w-5" />,
      accent: "bg-gold/10 text-gold",
    },
    {
      label: "شرکت فعال",
      value: formatNumber(employerCount),
      icon: <Building2 className="h-5 w-5" />,
      accent: "bg-slate/10 text-slate-dark",
    },
    {
      label: "کارجو",
      value: formatNumber(candidateCount),
      icon: <Users className="h-5 w-5" strokeWidth={1.8} />,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <main className="overflow-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative mesh-gradient">
        {/* decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* large soft blobs */}
          <div className="absolute -right-48 -top-48 h-130 w-130 rounded-full bg-gold/10 blur-[80px]" />
          <div className="absolute -bottom-56 -left-40 h-120 w-120 rounded-full bg-slate/8 blur-[80px]" />
          <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

          {/* floating geometric shapes */}
          <div className="absolute right-[12%] top-[18%] hidden h-16 w-16 rotate-12 rounded-2xl border border-gold/20 bg-white/40 shadow-lg backdrop-blur-sm lg:block animate-float">
            <Briefcase className="m-3.5 h-9 w-9 text-gold/60" strokeWidth={1.5} />
          </div>

          <div className="absolute left-[10%] top-[30%] hidden h-14 w-14 rounded-full border border-slate/20 bg-white/40 shadow-lg backdrop-blur-sm lg:block animate-float-slow">
            <Clock className="m-3.5 h-7 w-7 text-slate-dark/50" strokeWidth={1.8} />
          </div>

          <div className="absolute bottom-[28%] right-[30%] hidden h-11 w-11 rounded-xl bg-gold/15 shadow-lg backdrop-blur-sm lg:block animate-float-delayed" />
          <div className="absolute bottom-[22%] left-[22%] hidden h-8 w-8 rounded-full border-2 border-dashed border-gold/30 lg:block animate-float-slow" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* badge */}
            <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/60 px-4 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              مسیر شغلی جدید شما از این‌جا آغاز می‌شود
            </span>

            {/* headline */}
            <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="animate-fade-in-up-delay-1 block">
                فرصت‌ها را پیدا کنید.
              </span>
              <span className="animate-fade-in-up-delay-2 mt-3 block bg-linear-to-l from-gold via-gold-hover to-gold bg-clip-text text-transparent">
                آینده را بسازید.
              </span>
            </h1>

            <p className="animate-fade-in-up-delay-2 mx-auto mt-6 max-w-2xl text-sm leading-8 text-ink-muted md:text-lg md:leading-9">
              شغل مناسب خود را پیدا کنید، یا استعدادهایی را جذب کنید که تیم
              شما به آن‌ها نیاز دارد.
            </p>

            {/* ── Search ── */}
            <div className="animate-fade-in-up-delay-3 mt-10 rounded-4xl border border-white/50 bg-white/70 p-2.5 shadow-[0_24px_80px_-24px_rgba(44,57,71,0.2)] backdrop-blur-2xl">
              <form action="/jobs" method="GET">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_0.85fr_auto]">
                  <label className="group flex min-h-16 cursor-text items-center gap-3 rounded-3xl border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                    <Search className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                    <input
                      type="text"
                      name="q"
                      placeholder="عنوان شغل، مهارت یا کلمه کلیدی"
                      aria-label="عنوان شغل، مهارت یا کلمه کلیدی"
                      className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
                    />
                  </label>

                  <label className="group flex min-h-16 cursor-text items-center gap-3 rounded-3xl border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                    <MapPin className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                    <input
                      type="text"
                      name="city"
                      placeholder="شهر"
                      aria-label="شهر"
                      className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="group flex min-h-16 items-center justify-center gap-2 rounded-3xl bg-ink px-8 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_16px_32px_-12px_rgba(44,57,71,0.5)] active:translate-y-0"
                  >
                    <Search className="h-4 w-4" />
                    جستجوی شغل
                  </button>
                </div>
              </form>
            </div>

            {/* ── Category chips ── */}
            {sortedCategories.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-ink-muted">دسته‌های پرطرفدار:</span>
                {sortedCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/jobs?category=${encodeURIComponent(category)}`}
                    className="rounded-full border border-ink/10 bg-white/50 px-3.5 py-1.5 text-ink-muted shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5 hover:text-ink hover:shadow-[0_8px_16px_-8px_rgba(194,165,109,0.5)]"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* ── Stats ── */}
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`group rounded-3xl border border-white/60 bg-white/50 p-5 text-center shadow-[0_12px_32px_-16px_rgba(44,57,71,0.15)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(44,57,71,0.24)] md:p-6 ${
                    i === 1 ? "sm:border-x sm:border-y-0 sm:border-gold/20" : ""
                  }`}
                >
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent}`}>
                    {stat.icon}
                  </div>
                  <p className="mt-3 text-2xl font-black text-ink md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ LATEST JOBS ═══════════ */}
      <section className="relative border-t border-ink/5 bg-ink/2">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-0 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-slate/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-gold">
                <span className="h-px w-8 rounded-full bg-gold/40" />
                جدیدترین فرصت‌ها
              </span>
              <h2 className="mt-3 text-2xl font-black text-ink md:text-4xl">
                آخرین آگهی‌های استخدام
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">
                تازه‌ترین موقعیت‌های شغلی که شرکت‌ها منتشر کرده‌اند را همین‌جا
                مشاهده کنید. جدیدترین فرصت‌ها همیشه در بالای لیست قرار دارند.
              </p>
            </div>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-6 py-3 text-sm font-semibold text-ink shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.4)] focus-visible:outline-none focus-visible:border-gold/40 focus-visible:ring-4 focus-visible:ring-gold/25"
            >
              مشاهده همه آگهی‌ها
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/10 bg-white/50 p-16 text-center text-ink-muted backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Search className="h-7 w-7 text-gold" strokeWidth={1.8} />
              </div>
              هنوز فرصت شغلی منتشر نشده است.
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative pb-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="relative isolate overflow-hidden rounded-[48px] bg-ink px-6 py-20 text-center shadow-[0_48px_100px_-32px_rgba(44,57,71,0.5)] md:px-16 md:py-28">
            {/* decorative gradients */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-[80px]" />
              <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold/10 blur-[80px]" />
              <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-b from-white/20 to-transparent" />
              <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-b from-transparent to-white/10" />
              {/* floating sparks */}
              <div className="absolute right-[18%] top-[20%] h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(194,165,109,0.5)] animate-float" />
              <div className="absolute left-[22%] top-[30%] h-1.5 w-1.5 rounded-full bg-gold/70 shadow-[0_0_10px_1px_rgba(194,165,109,0.4)] animate-float-delayed" />
              <div className="absolute bottom-[24%] right-[28%] h-1.5 w-1.5 rounded-full bg-white/30 animate-float-slow" />
            </div>

            <div className="mx-auto max-w-3xl">
              <span className="animate-pulse-glow inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
                جابینو برای همه
              </span>

              <h2 className="mt-6 text-3xl font-black leading-[1.4] text-paper md:text-5xl md:leading-[1.35]">
                چه به دنبال کار باشید،
                <br />
                چه به دنبال نیروی جدید،
                <br />
                <span className="text-gradient-gold">همه‌چیز از این‌جا آغاز می‌شود.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-paper/60 md:text-base">
                همین حالا اولین قدم را بردارید؛ ادامه‌ی مسیر را به ما بسپارید.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/jobs"
                  className="rounded-2xl bg-paper px-8 py-4 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(232,237,242,0.4)] active:translate-y-0"
                >
                  پیدا کردن شغل
                </Link>

                {!session && (
                  <Link
                    href="/register"
                    className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0"
                  >
                    شروع رایگان
                  </Link>
                )}
                {session?.user.role === "EMPLOYER" && (
                  <Link
                    href="/employer/new"
                    className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0"
                  >
                    ثبت آگهی جدید
                  </Link>
                )}
                {session?.user.role === "CANDIDATE" && (
                  <Link
                    href="/candidate"
                    className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0"
                  >
                    درخواست‌های من
                  </Link>
                )}
              </div>

              {/* trust row */}
              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-paper/40">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-gold/60" />
                  ثبت‌نام کاملاً رایگان
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-gold/60" />
                  آگهی‌های به‌روز
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-gold/60" />
                  بدون واسطه
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}