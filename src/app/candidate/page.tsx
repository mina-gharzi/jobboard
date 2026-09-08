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
      select: { phone: true, resumeUrl: true, bio: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (totalCount > 0 && page > totalPages) {
    redirect(`/candidate?page=${totalPages}`);
  }

  const isProfileIncomplete =
    !profile?.phone || !profile?.resumeUrl || !profile?.bio;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">درخواست‌های من</h1>
        <Link
          href="/candidate/profile"
          className="shrink-0 rounded-md border border-line px-4 py-2 text-sm text-ink transition hover:border-gold/40 hover:text-gold"
        >
          پروفایل من
        </Link>
      </div>

      {isProfileIncomplete && (
        <Link
          href="/candidate/profile"
          className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-ink transition hover:bg-gold/10"
        >
          <span>
            پروفایلت کامل نیست — شماره تماس، رزومه یا معرفی کوتاه رو اضافه کن تا شانس دیده‌شدنت پیش کارفرماها بیشتر بشه.
          </span>
          <span className="shrink-0 font-semibold text-gold">تکمیل پروفایل ←</span>
        </Link>
      )}

      {applications.length === 0 ? (
        <p className="text-ink-muted">هنوز برای هیچ آگهی‌ای اپلای نکرده‌اید.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {applications.map((app) => (
              <li key={app.id}>
                <JobCard
                  job={app.job}
                  footer={
                    <span className={applicationStatusBadge[app.status]}>{applicationStatusLabels[app.status]}</span>
                  }
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
              {page > 1 ? (
                <Link href={`/candidate?page=${page - 1}`} className="text-slate hover:underline">
                  ← صفحه‌ی قبل
                </Link>
              ) : (
                <span />
              )}

              <span className="text-ink-muted">
                صفحه‌ی {page} از {totalPages}
              </span>

              {page < totalPages ? (
                <Link href={`/candidate?page=${page + 1}`} className="text-slate hover:underline">
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
