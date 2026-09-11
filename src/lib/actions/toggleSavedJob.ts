"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type ToggleSavedJobState = {
  success: boolean;
  message: string;
  saved: boolean;
};

export async function toggleSavedJob(jobId: string): Promise<ToggleSavedJobState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "باید وارد شوید", saved: false };
  }

  if (session.user.role !== "CANDIDATE") {
    return { success: false, message: "فقط کارجوها می‌توانند آگهی ذخیره کنند", saved: false };
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, slug: true, status: true },
  });

  if (!job || job.status !== "PUBLISHED") {
    return { success: false, message: "این آگهی در دسترس نیست", saved: false };
  }

  const existing = await prisma.savedJob.findUnique({
    where: {
      jobId_candidateId: { jobId, candidateId: session.user.id },
    },
  });

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    revalidatePath("/candidate");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${job.slug}`);
    return { success: true, saved: false, message: "آگهی از ذخیره‌ها حذف شد" };
  }

  try {
    await prisma.savedJob.create({
      data: { jobId, candidateId: session.user.id },
    });
  } catch (error) {
    // اگر بین چک "existing" و create یک درخواست موازی (مثلاً کلیک دوباره‌ی سریع
    // کاربر) همان جفت job/candidate را ثبت کرده باشد، unique constraint (کد P2002)
    // خطا می‌دهد؛ در این حالت آگهی عملاً ذخیره شده است، پس به‌جای خطا، موفقیت
    // برمی‌گردانیم تا دکمه هایچینگ نشود. هر خطای دیگر باید پیام درست خودش را بگیرد.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: true, saved: true, message: "آگهی قبلاً ذخیره شده است" };
    }

    console.error("toggleSavedJob failed:", error);
    return {
      success: false,
      saved: false,
      message: "مشکلی در ذخیره‌ی آگهی پیش آمد. لطفاً دوباره تلاش کنید.",
    };
  }

  revalidatePath("/candidate");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${job.slug}`);

  return { success: true, saved: true, message: "آگهی ذخیره شد" };
}