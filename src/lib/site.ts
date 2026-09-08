// آدرس پایه‌ی سایت، برای ساخت URL مطلق تو sitemap، robots.txt و
// structured data. همون env varی که auth-client.ts برای baseURL استفاده
// می‌کنه رو دوباره استفاده می‌کنیم تا یک منبع حقیقت داشته باشیم.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
