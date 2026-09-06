import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import ApplyForm from "./ApplyForm";
import JobCard from "@/components/JobCard";
import { remoteTypeLabels, formatSalary, formatRelativeTime } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  return prisma.job.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      employer: { select: { name: true, image: true } },
    },
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return { title: "آگهی یافت نشد" };
  }

  return {
    title: `${job.title} — ${job.city} | Job Board`,
    description: job.description.slice(0, 150),
  };
}

function MetaPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-3 py-1.5 text-sm text-ink-muted">
      {icon}
      {children}
    </span>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  const session = await auth.api.getSession({ headers: await headers() });

  if (!job) {
    notFound();
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const initial = job.employer?.name?.trim()?.[0] ?? job.category.trim()[0] ?? "؟";

  const relatedJobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      category: job.category,
      id: { not: job.id },
    },
    include: {
      employer: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
      >
        <svg
          className="h-4 w-4 rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        بازگشت به آگهی‌ها
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {/* ستون اصلی */}
        <div className="md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate/10 text-xl font-bold text-slate-dark">
              {job.employer?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.employer.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
                {job.title}
              </h1>
              {job.employer?.name && (
                <p className="mt-1 text-ink-muted">{job.employer.name}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <MetaPill
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              }
            >
              {job.city}
            </MetaPill>
            <MetaPill
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              }
            >
              {remoteTypeLabels[job.remoteType]}
            </MetaPill>
            <MetaPill
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2 2 12l10 10 10-10z" />
                  <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              }
            >
              {job.category}
            </MetaPill>
            {salary && (
              <MetaPill
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                }
              >
                {salary}
              </MetaPill>
            )}
            <MetaPill
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              }
            >
              {formatRelativeTime(job.createdAt)}
            </MetaPill>
          </div>

          <hr className="divider my-8 border-t" />

          <div className="prose-none">
            <h2 className="font-display text-lg font-bold text-ink">شرح موقعیت شغلی</h2>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-ink">
              {job.description}
            </p>
          </div>

          {/* اپلای در نمای موبایل، زیر توضیحات */}
          <div className="mt-10 md:hidden">
            <ApplyBox session={session} jobId={job.id} />
          </div>

          {relatedJobs.length > 0 && (
            <>
              <hr className="divider my-10 border-t" />
              <div>
                <h2 className="font-display text-lg font-bold text-ink">مشاغل مشابه</h2>
                <ul className="mt-4 flex flex-col gap-4">
                  {relatedJobs.map((related) => (
                    <li key={related.id}>
                      <JobCard job={related} />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* سایدبار اپلای — فقط دسکتاپ */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ApplyBox session={session} jobId={job.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplyBox({
  session,
  jobId,
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  jobId: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5 shadow-[0_14px_32px_rgba(44,57,71,0.06)]">
      {session?.user.role === "CANDIDATE" && <ApplyForm jobId={jobId} />}
      {!session && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">
            برای اپلای به این آگهی ابتدا باید وارد حساب کاربری‌ات بشی.
          </p>
          <Link href="/login" className="btn-primary rounded-md px-4 py-2 text-center text-sm">
            ورود
          </Link>
          <Link
            href="/register"
            className="btn-gold rounded-md px-4 py-2 text-center text-sm"
          >
            ساخت حساب کاربری
          </Link>
        </div>
      )}
      {session?.user.role === "EMPLOYER" && (
        <p className="text-sm text-ink-muted">
          حساب‌های کارفرما نمی‌توانند برای آگهی‌ها اپلای کنند.
        </p>
      )}
    </div>
  );
}
