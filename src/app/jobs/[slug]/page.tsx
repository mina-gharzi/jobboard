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
      <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        {job.city} ·{" "}
        {job.remoteType === "ONSITE"
          ? "حضوری"
          : job.remoteType === "REMOTE"
            ? "دورکاری"
            : "ترکیبی"}{" "}
        · {job.category}
      </p>

      {(job.salaryMin || job.salaryMax) && (
        <p className="mt-2 text-sm text-gray-700">
          حقوق: {job.salaryMin ?? "؟"} تا {job.salaryMax ?? "؟"}
        </p>
      )}

      <hr className="my-6 border-gray-200" />

      <p className="whitespace-pre-wrap text-gray-800 leading-7">
        {job.description}
      </p>

      <hr className="my-6 border-gray-200" />

      {session?.user.role === "CANDIDATE" && <ApplyForm jobId={job.id} />}
      {!session && (
        <p className="text-sm text-gray-500">برای اپلای کردن باید وارد شوید.</p>
      )}
      {session?.user.role === "EMPLOYER" && (
        <p className="text-sm text-gray-500">
          کارفرماها نمی‌توانند اپلای کنند.
        </p>
      )}
    </div>
  );
}
