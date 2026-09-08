"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateApplicationStatusSchema, toStr } from "@/lib/validation";

export type UpdateStatusState = {
  error?: string;
  success?: boolean;
};

export async function updateApplicationStatus(
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "EMPLOYER") {
    return { error: "دسترسی غیرمجاز" };
  }

  const parsed = updateApplicationStatusSchema.safeParse({
    applicationId: toStr(formData.get("applicationId")),
    status: toStr(formData.get("status")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { applicationId, status } = parsed.data;

  // چک مالکیت: این درخواست باید مال یکی از آگهی‌های همین کارفرما باشه
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || application.job.employerId !== session.user.id) {
    return { error: "این درخواست متعلق به شما نیست" };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  revalidatePath(`/employer/jobs/${application.jobId}/applicants`);

  return { success: true };
}