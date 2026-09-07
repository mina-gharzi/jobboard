"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateJobSchema, toStr } from "@/lib/validation";

async function getOwnedJob(jobId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "EMPLOYER") {
    return { job: null, error: "دسترسی غیرمجاز" } as const;
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.employerId !== session.user.id) {
    return { job: null, error: "این آگهی متعلق به شما نیست" } as const;
  }

  return { job, error: null } as const;
}

export type UpdateJobState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    description?: string;
    category?: string;
    city?: string;
    remoteType?: string;
    status?: string;
    salaryMin?: string;
    salaryMax?: string;
  };
};

export async function updateJob(
  jobId: string,
  _prevState: UpdateJobState,
  formData: FormData
): Promise<UpdateJobState> {
  const { job, error } = await getOwnedJob(jobId);

  if (!job) {
    return { error: error ?? "خطایی رخ داد" };
  }

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
    const fe = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        title: fe.title?.[0],
        description: fe.description?.[0],
        category: fe.category?.[0],
        city: fe.city?.[0],
        remoteType: fe.remoteType?.[0],
        status: fe.status?.[0],
        salaryMin: fe.salaryMin?.[0],
        salaryMax: fe.salaryMax?.[0],
      },
    };
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
  revalidatePath(`/jobs/${job.slug}`);
  redirect("/employer");
}

export type DeleteJobState = {
  error?: string;
};

export async function deleteJob(
  jobId: string,
  _prevState: DeleteJobState,
  _formData: FormData
): Promise<DeleteJobState> {
  const { job, error } = await getOwnedJob(jobId);

  if (!job) {
    return { error: error ?? "خطایی رخ داد" };
  }

  // چون Application به Job وصل است، اول درخواست‌های مرتبط حذف می‌شوند
  await prisma.$transaction([
    prisma.application.deleteMany({ where: { jobId } }),
    prisma.job.delete({ where: { id: jobId } }),
  ]);

  revalidatePath("/jobs");
  revalidatePath("/employer");
  revalidatePath(`/jobs/${job.slug}`);
  redirect("/employer");
}
