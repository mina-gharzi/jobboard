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
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>{job.title}</h1>
      <p>
        {job.city} · {job.remoteType} · {job.category}
      </p>
      {(job.salaryMin || job.salaryMax) && (
        <p>
          حقوق: {job.salaryMin ?? "؟"} تا {job.salaryMax ?? "؟"}
        </p>
      )}
      <hr />

      <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
      <hr />
      {session?.user.role === "CANDIDATE" && <ApplyForm jobId={job.id} />}
      {!session && <p>برای اپلای کردن باید وارد شوید.</p>}
      {session?.user.role === "EMPLOYER" && (
        <p>کارفرماها نمی‌توانند اپلای کنند.</p>
      )}
      {session?.user.role === "EMPLOYER" && (
        <p>کارفرماها نمی‌توانند اپلای کنند.</p>
      )}
    </div>
  );
}
