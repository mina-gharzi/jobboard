"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateJobSchema, toStr } from "@/lib/validation";

async function requireJobOwner(jobId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "EMPLOYER") {
    throw new Error("دسترسی غیرمجاز");
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.employerId !== session.user.id) {
    throw new Error("این آگهی متعلق به شما نیست");
  }

  return job;
}

export async function updateJob(jobId: string, formData: FormData) {
  await requireJobOwner(jobId);

  const parsed = updateJobSchema.safeParse({
    title: toStr(formData.get("title")),
    description: toStr(formData.get("description")),
    category: toStr(formData.get("category")),
    city: toStr(formData.get("city")),
    remoteType: toStr(formData.get("remoteType")),
    status: toStr(formData.get("status")),
    salaryMin: toStr(formData.get("salaryMin")),
    salaryMax: toStr(formData.get("salaryMax")),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { title, description, category, city, remoteType, status, salaryMin, salaryMax } =
    parsed.data;

  await prisma.job.update({
    where: { id: jobId },
    data: {
      title,
      description,
      category,
      city,
      remoteType,
      status,
      salaryMin: salaryMin ?? null,
      salaryMax: salaryMax ?? null,
    },
  });

  revalidatePath("/jobs");
  revalidatePath("/employer");
  redirect("/employer");
}

export async function deleteJob(jobId: string) {
  await requireJobOwner(jobId);

  // چون Application به Job وصل است، اول درخواست‌های مرتبط حذف می‌شوند
  await prisma.$transaction([
    prisma.application.deleteMany({ where: { jobId } }),
    prisma.job.delete({ where: { id: jobId } }),
  ]);

  revalidatePath("/jobs");
  revalidatePath("/employer");
  redirect("/employer");
}
