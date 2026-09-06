import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { applyToJob } from "@/lib/actions/applyToJob";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ApplyForm from "./ApplyForm";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  return prisma.job.findUnique({
    where: { slug, status: "PUBLISHED" },
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

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">{job.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {job.city} ·{" "}
        {job.remoteType === "ONSITE"
          ? "حضوری"
          : job.remoteType === "REMOTE"
            ? "دورکاری"
            : "ترکیبی"}{" "}
        · {job.category}
      </p>

      {(job.salaryMin || job.salaryMax) && (
        <p className="mt-2 text-sm text-ink">
          حقوق: {job.salaryMin ?? "؟"} تا {job.salaryMax ?? "؟"}
        </p>
      )}

      <hr className="divider my-6 border-t" />

      <p className="whitespace-pre-wrap text-ink leading-7">
        {job.description}
      </p>

      <hr className="divider my-6 border-t" />

      {session?.user.role === "CANDIDATE" && <ApplyForm jobId={job.id} />}
      {!session && (
        <p className="text-sm text-ink-muted">برای اپلای کردن باید وارد شوید.</p>
      )}
      {session?.user.role === "EMPLOYER" && (
        <p className="text-sm text-ink-muted">
          کارفرماها نمی‌توانند اپلای کنند.
        </p>
      )}
    </div>
  );
}
