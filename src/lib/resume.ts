import { uploadPublicFile, deleteFile, isOwnBlobUrl } from "./storage";

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 مگابایت

const RESUME_KEY_PREFIX = "resumes/";

/**
 * اعتبارسنجی و آپلود فایل رزومه به Vercel Blob. آدرس عمومی فایل
 * ذخیره‌شده (مثلاً
 * `https://xxxx.public.blob.vercel-storage.com/resumes/abc-171....pdf`)
 * را برمی‌گرداند و در صورت نامعتبر بودن، پیام خطای فارسی پرتاب می‌کند.
 *
 * قبلاً این تابع فایل را مستقیم روی دیسک سرور (public/uploads/resumes)
 * می‌نوشت — که روی Vercel کار نمی‌کند، چون فایل‌سیستم آن‌جا در هر
 * invocation موقتی (ephemeral) است. حالا آپلود از طریق lib/storage.ts
 * به Vercel Blob انجام می‌شود (باید از Vercel Dashboard یک Blob Store
 * به پروژه وصل شود).
 */
export async function saveResumePdf(file: File, userId: string): Promise<string> {
  if (file.size === 0) {
    throw new Error("فایلی انتخاب نشده است");
  }
  if (file.size > MAX_RESUME_SIZE) {
    throw new Error("حجم فایل رزومه نمی‌تواند بیشتر از ۵ مگابایت باشد");
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("فقط فایل PDF مجاز است");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // شناسه‌ی تصادفی ساده برای جلوگیری از برخورد نام وقتی کاربر چند فایل پشت
  // سر هم (مثلاً برای اپلای‌های مختلف) بارگذاری می‌کند.
  const suffix = Math.random().toString(36).slice(2, 8);
  const key = `${RESUME_KEY_PREFIX}${userId}-${Date.now()}-${suffix}.pdf`;

  try {
    return await uploadPublicFile(key, buffer, "application/pdf");
  } catch (error) {
    console.error("آپلود رزومه ناموفق بود:", error);
    throw new Error("خطایی در ذخیره‌ی فایل رخ داد. لطفاً دوباره تلاش کنید.");
  }
}

/**
 * حذف فایل رزومه‌ی قبلی. برای امنیت فقط آدرس‌هایی حذف می‌شوند که واقعاً
 * متعلق به Blob Store همین پروژه باشند (isOwnBlobUrl این را تضمین
 * می‌کند)؛ مقادیر خارجی یا مخدوش دیتابیس بی‌تأثیر نادیده گرفته می‌شوند.
 */
export async function deleteResumePdf(
  publicPath: string | null | undefined
): Promise<void> {
  if (!publicPath || !isOwnBlobUrl(publicPath)) return;

  await deleteFile(publicPath);
}