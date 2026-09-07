import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import EditJobForm from "./EditJobForm";
import DeleteJobForm from "./DeleteJobForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.employerId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">ویرایش آگهی</h1>

      <EditJobForm job={job} />
      <DeleteJobForm jobId={job.id} />
    </div>
  );
}
