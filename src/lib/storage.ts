import { put, del } from "@vercel/blob";

/**
 * لایه‌ی ذخیره‌سازی فایل با Vercel Blob.
 *
 * قبلاً فایل‌ها (رزومه‌ها) مستقیم روی دیسک سرور (زیر public/uploads)
 * نوشته می‌شدند. این روی هاست‌های serverless مثل Vercel کار نمی‌کند،
 * چون فایل‌سیستم در هر invocation موقتی (ephemeral) است و پوشه‌ی
 * public در زمان build باندل می‌شود، نه در runtime قابل‌نوشتن.
 *
 * چون این پروژه روی Vercel دیپلوی می‌شود، به‌جای یک سرویس ابری جداگانه
 * (که نیاز به ثبت‌نام و گاهی کارت اعتباری دارد)، از Vercel Blob
 * استفاده می‌کنیم — بخشی از همان پلن Hobby رایگانی که پروژه رویش اجرا
 * می‌شود (۱ گیگ ذخیره‌سازی و ۱۰ گیگ ترافیک در ماه، رایگان).
 *
 * راه‌اندازی: از Vercel Dashboard پروژه، Storage → Create Database →
 * Blob را بزن و به پروژه وصلش کن. Vercel خودش متغیر محیطی
 * BLOB_READ_WRITE_TOKEN را ست می‌کند؛ نیازی به کپی دستی هیچ کلیدی نیست.
 * روی محیط توسعه‌ی لوکال هم با `vercel env pull` همین متغیر می‌آید.
 */

export async function uploadPublicFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(key, body, {
    access: "public",
    contentType,
    // چون خودمان یک suffix تصادفی تو نام فایل می‌گذاریم (در resume.ts)،
    // برخورد نام عملاً غیرممکن است؛ با خاموش‌کردن این گزینه، URL خروجی
    // همیشه دقیقاً همان چیزی می‌شود که انتظار داریم، نه یک نام تصادفیِ
    // اضافه‌ی دیگر.
    addRandomSuffix: false,
  });

  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url).catch(() => {});
}

/**
 * چک می‌کند که یک URL واقعاً متعلق به Blob Store همین پروژه است، نه یک
 * مقدار خارجی/مخدوش در دیتابیس. Vercel Blob به هر URL عمومی یک زیردامنه‌ی
 * ثابت `*.public.blob.vercel-storage.com` می‌دهد.
 */
export function isOwnBlobUrl(url: string): boolean {
  return /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(url);
}