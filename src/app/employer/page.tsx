import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { jobStatusLabels, jobStatusBadge } from "@/lib/status";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">آگهی‌های من</h1>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/employer/company"
            className="rounded-md border border-line px-4 py-2 text-sm text-ink transition hover:border-gold/40 hover:text-gold"
          >
            پروفایل شرکت
          </Link>
          <Link href="/employer/new" className="btn-primary rounded-md px-4 py-2 text-sm">
            + ثبت آگهی جدید
          </Link>
        </div>
      </div>

      {isCompanyProfileIncomplete && (
        <Link
          href="/employer/company"
          className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-ink transition hover:bg-gold/10"
        >
          <span>
            پروفایل شرکتت کامل نیست — لوگو، وب‌سایت یا توضیحات رو اضافه کن تا کارجوها بیشتر بهت اعتماد کنن.
          </span>
          <span className="shrink-0 font-semibold text-gold">تکمیل پروفایل ←</span>
        </Link>
      )}

      {jobs.length === 0 ? (
        <p className="text-ink-muted">هنوز آگهی‌ای ثبت نکرده‌اید.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard
                  job={job}
                  footer={
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={jobStatusBadge[job.status]}>{jobStatusLabels[job.status]}</span>
                        <span className="text-sm text-ink-muted">
                          {job._count.applications} درخواست دریافت‌شده
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Link href={`/employer/jobs/${job.id}/applicants`} className="text-slate underline">
                          مشاهده‌ی درخواست‌ها
                        </Link>
                        <Link href={`/employer/jobs/${job.id}/edit`} className="text-slate underline">
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
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
              {page > 1 ? (
                <Link href={`/employer?page=${page - 1}`} className="text-slate hover:underline">
                  ← صفحه‌ی قبل
                </Link>
              ) : (
                <span />
              )}

              <span className="text-ink-muted">
                صفحه‌ی {page} از {totalPages}
              </span>

              {page < totalPages ? (
                <Link href={`/employer?page=${page + 1}`} className="text-slate hover:underline">
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
