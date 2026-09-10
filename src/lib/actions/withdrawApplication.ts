"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteFile, isOwnBlobUrl } from "@/lib/storage";

type WithdrawState = {
  success: boolean;
  message: string;
};

/**
 * انصراف کارجو از یک درخواست. فقط تا وقتی اجازه داده می‌شود که کارفرما هنوز
 * نتیجه‌ی قطعی (پذیرش/رد) نداده باشد؛ بعد از ACCEPTED یا REJECTED واقعه‌ی شغلی
 * شکل گرفته و واگذاری دیگر قابل لغو نیست.
 */
export async function withdrawApplication(
  applicationId: string
): Promise<WithdrawState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "باید وارد شوید" };
  }

  if (session.user.role !== "CANDIDATE") {
    return { success: false, message: "فقط کارجوها می‌توانند درخواست را پس بگیرند" };
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: { select: { slug: true, status: true } },
    },
  });

  if (!application || application.candidateId !== session.user.id) {
    return { success: false, message: "این درخواست یافت نشد" };
  }

  if (application.job.status !== "PUBLISHED") {
    return { success: false, message: "این آگهی دیگر فعال نیست و درخواست قابلیت پس‌گرفتن ندارد" };
  }

  if (application.status === "ACCEPTED") {
    return {
      success: false,
      message: "این درخواست پذیرفته شده است و دیگر امکان انصراف ندارد؛ لطفاً مستقیماً با کارفرما در تماس باشید",
    };
  }
  if (application.status === "REJECTED") {
    return {
      success: false,
      message: "این درخواست رد شده است و نیازی به انصراف ندارد",
    };
  }

  // فایل رزومه‌ی مربوط به همین درخواست را (اگر متعلق به Blob Store همین پروژه
  // باشد) حذف می‌کنیم تا بعد از انصراف به‌کار نرود؛ خطای آپلود/حذف نباید مانع
  // انصراف شود، پس در try/catch جدا کرده‌ایم.
  if (application.resumePdf && isOwnBlobUrl(application.resumePdf)) {
    try {
      await deleteFile(application.resumePdf);
    } catch (error) {
      console.error("حذف رزومه هنگام انصراف ناموفق بود:", error);
    }
  }

  await prisma.application.delete({ where: { id: applicationId } });

  revalidatePath("/candidate");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${application.job.slug}`);

  return { success: true, message: "درخواست شما با موفقیت پس گرفته شد" };
}