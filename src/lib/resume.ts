import { promises as fs } from "fs";
import path from "path";

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 مگابایت

const RESUME_DIR = path.join(process.cwd(), "public", "uploads", "resumes");

export const PUBLIC_RESUME_PREFIX = "/uploads/resumes/";

/**
 * اعتبارسنجی و ذخیره‌ی فایل رزومه روی فایل‌سیستم. مسیر عمومی فایل
 * ذخیره‌شده (مثلاً `/uploads/resumes/abc-1715000000000.pdf`) را
 * برمی‌گرداند و در صورت نامعتبر بودن، پیام خطای فارسی پرتاب می‌کند.
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
  const fileName = `${userId}-${Date.now()}-${suffix}.pdf`;

  await fs.mkdir(RESUME_DIR, { recursive: true });
  await fs.writeFile(path.join(RESUME_DIR, fileName), buffer);

  return `${PUBLIC_RESUME_PREFIX}${fileName}`;
}

/**
 * حذف فایل رزومه‌ی قبلی. برای امنیت فقط مسیرهایی حذف می‌شوند که با
 * پیشوند عمومی پوشه‌ی رزومه شروع شوند و خود فایل باشند؛ مقادیر خارجی
 * یا مخدوش دیتابیس بی‌تأثیر نادیده گرفته می‌شوند.
 */
export async function deleteResumePdf(
  publicPath: string | null | undefined
): Promise<void> {
  if (!publicPath || !publicPath.startsWith(PUBLIC_RESUME_PREFIX)) return;

  const fileName = publicPath.slice(PUBLIC_RESUME_PREFIX.length);
  if (!fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return;
  }

  await fs.unlink(path.join(RESUME_DIR, fileName)).catch(() => {});
}