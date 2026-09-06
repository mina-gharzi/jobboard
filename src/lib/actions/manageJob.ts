"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const city = formData.get("city") as string;
  const remoteType = formData.get("remoteType") as string;
  const status = formData.get("status") as string;
  const salaryMinRaw = formData.get("salaryMin") as string;
  const salaryMaxRaw = formData.get("salaryMax") as string;

  if (!title || !description || !category || !city || !remoteType || !status) {
    throw new Error("همه‌ی فیلدها الزامی هستند");
  }

  const salaryMin = salaryMinRaw ? Number(salaryMinRaw) : null;
  const salaryMax = salaryMaxRaw ? Number(salaryMaxRaw) : null;

  if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    throw new Error("حداقل حقوق نمی‌تواند بیشتر از حداکثر باشد");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      title,
      description,
      category,
      city,
      remoteType: remoteType as "ONSITE" | "REMOTE" | "HYBRID",
      status: status as "DRAFT" | "PUBLISHED" | "CLOSED",
      salaryMin,
      salaryMax,
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