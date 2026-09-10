import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { jobStatusLabels, jobStatusBadge } from "@/lib/status";
import { Plus, TriangleAlert, SquarePlus, ChevronRight, ChevronLeft } from "lucide-react";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default async function EmployerDashboard({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);

  const [jobs, totalCount, profile] = await Promise.all([
    prisma.job.findMany({
      where: { employerId: session.user.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where: { employerId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true, companyDescription: true, companyWebsite: true, companyTeamSize: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // صفحه‌ی خارج از محدوده (مثلاً بعد از حذف چند آگهی، یا URL دستکاری‌شده)
  // به آخرین صفحه‌ی معتبر redirect می‌شه، وگرنه یه لیست خالی و گمراه‌کننده
  // («هنوز آگهی‌ای ثبت نکرده‌اید») نشون داده می‌شه در حالی که آگهی هست.
  if (totalCount > 0 && page > totalPages) {
    redirect(`/employer?page=${totalPages}`);
  }

  const isCompanyProfileIncomplete =
    !profile?.image || !profile?.companyDescription || !profile?.companyWebsite || !profile?.companyTeamSize;

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
              پنل کارفرما
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-4xl">
              آگهی‌های من
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/employer/company"
              className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-2.5 text-sm font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] active:translate-y-0"
            >
              پروفایل شرکت
            </Link>
            <Link
              href="/employer/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)] transition hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              ثبت آگهی جدید
            </Link>
          </div>
        </header>

        {isCompanyProfileIncomplete && (
          <Link
            href="/employer/company"
            className="group mb-8 flex items-center justify-between gap-3 rounded-3xl border border-gold/25 bg-gold/5 px-5 py-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-gold/10 hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.4)]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <TriangleAlert className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm text-ink">
                پروفایل شرکت شما کامل نیست — لوگو، وب‌سایت یا توضیحات اضافه کنید تا کارجوها بیشتر به شما اعتماد کنند.
              </span>
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-gold">
              تکمیل پروفایل
              <ChevronRight className="h-4 w-4 -scale-x-100 transition-transform group-hover:-translate-x-1" />
            </span>
          </Link>
        )}

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-4xl border border-dashed border-ink/10 bg-white/50 px-6 py-14 text-center backdrop-blur-sm md:px-8 md:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <SquarePlus className="h-8 w-8 text-gold" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-bold text-ink">هنوز آگهی‌ای ثبت نکرده‌اید.</p>
              <p className="mt-1 text-sm text-ink-muted">
                اولین آگهی خودتون رو ثبت کنید تا کارجوها بتونن براش اپلای کنن.
              </p>
            </div>
            <Link
              href="/employer/new"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90"
            >
              ثبت آگهی جدید
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-5">
              {jobs.map((job) => (
                <li key={job.id}>
                  <JobCard
                    job={job}
                    footer={
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={jobStatusBadge[job.status]}>{jobStatusLabels[job.status]}</span>
                          <span className="text-sm text-ink-muted">
                            {formatNumber(job._count.applications)} درخواست دریافت‌شده
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                          <Link
                            href={`/employer/jobs/${job.id}/applicants`}
                            className="text-slate underline-offset-4 transition hover:text-gold hover:underline"
                          >
                            مشاهده‌ی درخواست‌ها
                          </Link>
                          <Link
                            href={`/employer/jobs/${job.id}/edit`}
                            className="text-slate underline-offset-4 transition hover:text-gold hover:underline"
                          >
                            ویرایش
                          </Link>
                        </div>
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
                    href={`/employer?page=${page - 1}`}
                    aria-label="صفحه‌ی قبل"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/5 text-ink-muted/30" />
                )}

                <span className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-ink px-4 text-sm font-bold text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)]">
                  صفحه‌ی {formatNumber(page)} از {formatNumber(totalPages)}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/employer?page=${page + 1}`}
                    aria-label="صفحه‌ی بعد"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
                  >
                    <ChevronLeft className="h-4 w-4" />
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