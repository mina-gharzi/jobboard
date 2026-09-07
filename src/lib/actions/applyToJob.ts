"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { applyToJobSchema, toStr } from "@/lib/validation";

type ApplyState = {
  success: boolean;
  message: string;
};

export async function applyToJob(
  jobId: string,
  _prevState: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "باید وارد شوید" };
  }

  if (session.user.role !== "CANDIDATE") {
    return { success: false, message: "فقط کارجوها می‌توانند اپلای کنند" };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.status !== "PUBLISHED") {
    return { success: false, message: "این آگهی دیگر برای اپلای در دسترس نیست" };
  }

  const parsed = applyToJobSchema.safeParse({
    coverLetter: toStr(formData.get("coverLetter")),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_candidateId: {
        jobId,
        candidateId: session.user.id,
      },
    },
  });

  if (existing) {
    return { success: false, message: "شما قبلاً برای این آگهی اپلای کرده‌اید" };
  }

  await prisma.application.create({
    data: {
      jobId,
      candidateId: session.user.id,
      coverLetter: parsed.data.coverLetter || null,
    },
  });

  revalidatePath(`/jobs`);

  return { success: true, message: "درخواست شما با موفقیت ثبت شد" };
}
