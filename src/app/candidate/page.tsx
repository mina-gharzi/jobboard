import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import SaveJobButton from "@/components/SaveJobButton";
import WithdrawApplicationButton from "@/components/WithdrawApplicationButton";
import { applicationStatusLabels, applicationStatusBadge } from "@/lib/status";
import Pagination from "@/components/Pagination";
import { Bookmark, TriangleAlert, Search, File, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "پنل کارجو | جابینو" };

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

export default async function CandidateDashboard({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/jobs");

  const { tab: tabRaw, page: pageRaw } = await searchParams;
  const isSavedTab = tabRaw === "saved";
  const page = Math.max(1, Number(pageRaw) || 1);

  const [applications, savedJobs, applicationsCount, savedJobsCount, profile] =
    await Promise.all([
      prisma.application.findMany({
        where: { candidateId: session.user.id },
        include: {
          job: { include: { employer: { select: { name: true, image: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.savedJob.findMany({
        where: { candidateId: session.user.id },
        include: {
          job: { include: { employer: { select: { name: true, image: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.application.count({ where: { candidateId: session.user.id } }),
      prisma.savedJob.count({ where: { candidateId: session.user.id } }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true, resumePdf: true, bio: true },
      }),
    ]);

  const totalCount = isSavedTab ? savedJobsCount : applicationsCount;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (totalCount > 0 && page > totalPages) {
    redirect(`/candidate?tab=${isSavedTab ? "saved" : ""}&page=${totalPages}`);
  }

  const isProfileIncomplete = !profile?.phone || !profile?.resumePdf || !profile?.bio;
  const tabQuery = isSavedTab ? "saved" : "";

  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 md:px-10 md:pb-24 md:pt-16">
        {/* ── هدر ── */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold md:text-sm">
              <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
              پنل کارجو
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-4xl">
              {isSavedTab ? "آگهی‌های ذخیره‌شده" : "درخواست‌های من"}
            </h1>
          </div>

          <Link
            href="/candidate/profile"
            className="shrink-0 rounded-2xl border border-ink/10 bg-white/70 px-4 py-2.5 text-sm font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] active:translate-y-0"
          >
            پروفایل من
          </Link>
        </header>

        {/* ── تب‌ها ── */}
        <nav
          aria-label="بخش‌های داشبورد"
          className="mb-6 flex items-center gap-1 rounded-3xl border border-ink/10 bg-white/60 p-1.5 shadow-sm backdrop-blur md:mb-8 md:w-fit"
        >
          <Link
            href="/candidate"
            aria-current={isSavedTab ? undefined : "page"}
            className={`flex-1 rounded-2xl px-5 py-2.5 text-center text-sm font-bold transition md:flex-none ${
              isSavedTab
                ? "text-ink-muted hover:text-ink"
                : "bg-ink text-paper shadow-sm"
            }`}
          >
            درخواست‌های من
          </Link>
          <Link
            href="/candidate?tab=saved"
            aria-current={isSavedTab ? "page" : undefined}
            className={`flex-1 rounded-2xl px-5 py-2.5 text-center text-sm font-bold transition md:flex-none ${
              isSavedTab
                ? "bg-ink text-paper shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            آگهی‌های ذخیره‌شده
          </Link>
        </nav>

        {isProfileIncomplete && (
          <Link
            href="/candidate/profile"
            className="group mb-8 flex items-center justify-between gap-3 rounded-3xl border border-gold/25 bg-gold/5 px-5 py-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-gold/10 hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.4)]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <TriangleAlert className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm text-ink">
                پروفایل شما کامل نیست — شماره تماس، رزومه یا معرفی کوتاه اضافه کنید تا شانس دیده‌شدن شما پش کارفرماها افزایش یابد.
              </span>
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-gold">
              تکمیل پروفایل
              <ChevronRight className="h-4 w-4 -scale-x-100 transition-transform group-hover:-translate-x-1" />
            </span>
          </Link>
        )}

        {isSavedTab ? (
          savedJobs.length === 0 ? (
            <EmptyState
              icon={
                <Bookmark className="h-8 w-8" strokeWidth={1.8} />
              }
              title="هنوز هیچ آگهی‌ای ذخیره نکرده‌اید."
              desc="آگهی‌های مورد علاقه‌تان را با دکمه‌ی «ذخیره» نگه دارید و بعداً راحت پیگیری کنید."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-5">
                {savedJobs.map((item) => (
                  <li key={item.id}>
                    <JobCard
                      job={item.job}
                      footer={
                        <div className="flex w-full flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                            <Bookmark className="h-3.5 w-3.5 fill-gold" />
                            ذخیره‌شده
                          </span>
                          <SaveJobButton jobId={item.job.id} initialSaved signedIn />
                        </div>
                      }
                    />
                  </li>
                ))}
              </ul>

              <Pagination
                page={page}
                totalPages={totalPages}
                href={(p) => `/candidate?tab=${tabQuery}&page=${p}`}
              />
            </>
          )
        ) : applications.length === 0 ? (
          <EmptyState
            icon={
              <Search className="h-8 w-8" strokeWidth={1.8} />
            }
            title="هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید."
            desc="آگهی‌های باز رو ببینید و برای موقعیت‌های مناسب خودتون اپلای کنید."
          />
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
        <File className="h-3.5 w-3.5" />
        رزومه‌ی ارسالی
      </a>
    )}
    {["PENDING", "REVIEWED"].includes(
      app.status
    ) && (
      <span className="ms-auto">
        <WithdrawApplicationButton applicationId={app.id} />
      </span>
    )}
  </div>
}
                  />
                </li>
              ))}
            </ul>

            <Pagination
              page={page}
              totalPages={totalPages}
              href={(p) => `/candidate?tab=${tabQuery}&page=${p}`}
            />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-4xl border border-dashed border-ink/10 bg-white/50 px-6 py-14 text-center backdrop-blur-sm md:px-8 md:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold">
        {icon}
      </div>
      <div>
        <p className="font-bold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{desc}</p>
      </div>
      <Link
        href="/jobs"
        className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90"
      >
        مشاهده‌ی آگهی‌ها
      </Link>
    </div>
  );
}