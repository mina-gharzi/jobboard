// پاک‌سازی داده‌های تست‌های E2E از طریق endpoint محافظت‌شده‌ی اپ.
// (دریافت Prisma client به‌صورت مستقیم در این فایل ممکن نیست؛ خروجیِ
// prisma-client ESM است و `import.meta` را در loader پلی‌رایت CJS نمی‌پذیرد.)

const CLEANUP_URL =
  process.env.E2E_BASE_URL ?? "http://localhost:3000/api/e2e/cleanup";

export default async function globalTeardown() {
  try {
    const res = await fetch(CLEANUP_URL, { method: "POST" });
    if (!res.ok) {
      console.error(`[e2e] پاک‌سازی داده‌ها ناموفق بود (${res.status})`);
    }
  } catch (error) {
    console.error("[e2e] پاک‌سازی داده‌ها ناموفق بود:", error);
  }
}