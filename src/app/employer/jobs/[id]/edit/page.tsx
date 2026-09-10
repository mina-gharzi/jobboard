import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import EditJobForm from "./EditJobForm";
import DeleteJobForm from "./DeleteJobForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ویرایش آگهی | جابینو" };

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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 md:px-10 md:pt-16">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted md:text-sm">
            <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
            آگهی‌ها
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-3xl">ویرایش آگهی</h1>
        </header>

        <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-8">
          <EditJobForm job={job} />
          <DeleteJobForm jobId={job.id} />
        </div>
      </div>
    </div>
  );
}
