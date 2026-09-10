import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default async function CandidateDashboard({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/jobs");

  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);

  const [applications, totalCount, profile] = await Promise.all([
    prisma.application.findMany({
      where: { candidateId: session.user.id },
      include: {
        job: { include: { employer: { select: { name: true, image: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.application.count({ where: { candidateId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true, resumePdf: true, bio: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (totalCount > 0 && page > totalPages) {
    redirect(`/candidate?page=${totalPages}`);
  }

  const isProfileIncomplete = !profile?.phone || !profile?.resumePdf || !profile?.bio;

  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 md:px-10 md:pb-24 md:pt-16">
        {/* ── هدر ── */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 md:mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold md:text-sm">
              <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
              پنل کارجو
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-4xl">
              درخواست‌های من
            </h1>
          </div>

          <Link
            href="/candidate/profile"
            className="shrink-0 rounded-2xl border border-ink/10 bg-white/70 px-4 py-2.5 text-sm font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] active:translate-y-0"
          >
            پروفایل من
          </Link>
        </header>

        {isProfileIncomplete && (
          <Link
            href="/candidate/profile"
            className="group mb-8 flex items-center justify-between gap-3 rounded-3xl border border-gold/25 bg-gold/5 px-5 py-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-gold/10 hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.4)]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01" />
                  <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                </svg>
              </span>
              <span className="text-sm text-ink">
                پروفایل شما کامل نیست — شماره تماس، رزومه یا معرفی کوتاه اضافه کنید تا شانس دیده‌شدن شما پیش کارفرماها افزایش یابد.
              </span>
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-gold">
              تکمیل پروفایل
              <svg className="h-4 w-4 -scale-x-100 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </Link>
        )}

        {applications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[32px] border border-dashed border-ink/10 bg-white/50 px-6 py-14 text-center backdrop-blur-sm md:px-8 md:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <svg className="h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-ink">هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
              <p className="mt-1 text-sm text-ink-muted">
                آگهی‌های باز رو ببینید و برای موقعیت‌های مناسب خودتون اپلای کنید.
              </p>
            </div>
            <Link
              href="/jobs"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90"
            >
              مشاهده‌ی آگهی‌ها
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-5">
              {applications.map((app) => (
                <li key={app.id}>
                  <JobCard
                    job={app.job}
                    footer={
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={applicationStatusBadge[app.status]}>
                          {applicationStatusLabels[app.status]}
                        </span>
                        {app.resumePdf && (
                          <a
                            href={app.resumePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate underline-offset-4 hover:text-gold hover:underline"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6" />
                            </svg>
                            رزومه‌ی ارسالی
                          </a>
                        )}
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav
                aria-label="صفحه‌بندی"
                className="mt-10 flex flex-wrap items-center justify-center gap-2 md:mt-14"
              >
                {page > 1 ? (
                  <Link
                    href={`/candidate?page=${page - 1}`}
                    aria-label="صفحه‌ی قبل"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/5 text-ink-muted/30" />
                )}

                <span className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-ink px-4 text-sm font-bold text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)]">
                  صفحه‌ی {formatNumber(page)} از {formatNumber(totalPages)}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/candidate?page=${page + 1}`}
                    aria-label="صفحه‌ی بعد"
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