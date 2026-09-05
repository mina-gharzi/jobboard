"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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

  const coverLetter = formData.get("coverLetter") as string;

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
      coverLetter: coverLetter || null,
    },
  });

  revalidatePath(`/jobs`);

  return { success: true, message: "درخواست شما با موفقیت ثبت شد" };
}