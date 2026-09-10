import { uploadPublicFile, deleteFile, isOwnBlobUrl } from "./storage";

export const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 مگابایت
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LOGO_KEY_PREFIX = "logos/";

/**
 * اعتبارسنجی و آپلود فایل لوگوی شرکت به Vercel Blob.
 * فرمت‌های مجاز: JPEG، PNG، WebP — حداکثر ۲ مگابایت.
 */
export async function saveCompanyLogo(file: File, userId: string): Promise<string> {
  if (file.size === 0) {
    throw new Error("فایلی انتخاب نشده است");
  }
  if (file.size > MAX_LOGO_SIZE) {
    throw new Error("حجم فایل لوگو نمی‌تواند بیشتر از ۲ مگابایت باشد");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("فقط فایل‌های JPEG، PNG و WebP مجاز هستند");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const suffix = Math.random().toString(36).slice(2, 8);
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `${LOGO_KEY_PREFIX}${userId}-${Date.now()}-${suffix}.${ext}`;

  try {
    return await uploadPublicFile(key, buffer, file.type);
  } catch (error) {
    console.error("آپلود لوگو ناموفق بود:", error);
    throw new Error("خطایی در ذخیره‌ی فایل رخ داد. لطفاً دوباره تلاش کنید.");
  }
}

/**
 * حذف فایل لوگوی قبلی (فقط اگر متعلق به Blob Store همین پروژه باشد).
 */
export async function deleteCompanyLogo(url: string | null | undefined): Promise<void> {
  if (!url || !isOwnBlobUrl(url)) return;
  await deleteFile(url);
}
