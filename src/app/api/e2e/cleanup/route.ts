import { prisma } from "@/lib/prisma";

// پاک‌سازی داده‌های تست‌های E2E.
//
// فقط وقتی Server با `DISABLE_RATE_LIMIT=true` بالا آمده باشد (سرورِ ساختِ
// Playwright) در دسترس است؛ همین‌جا از دوگانگی «حالت تست» استفاده می‌کنیم که
// هم‌نام همان seam ای است که rate limiter ثبت‌نام را خاموش می‌کند، تا چنین
// endpoint خطری برای production نداشته باشد.
//
// ترتیب حذف مهم است تا FK نقض نشود: اول رکوردهای وابسته (SavedJob/Application)،
// بعد Job، آخر User (Session/Account با onDelete: Cascade حذف می‌شوند).
export async function POST() {
  if (process.env.DISABLE_RATE_LIMIT !== "true") {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  await prisma.$transaction([
    prisma.savedJob.deleteMany({
      where: {
        OR: [
          { candidate: { email: { endsWith: "@e2e.test" } } },
          { job: { employer: { email: { endsWith: "@e2e.test" } } } },
        ],
      },
    }),
    prisma.application.deleteMany({
      where: {
        OR: [
          { candidate: { email: { endsWith: "@e2e.test" } } },
          { job: { employer: { email: { endsWith: "@e2e.test" } } } },
        ],
      },
    }),
    prisma.job.deleteMany({
      where: { employer: { email: { endsWith: "@e2e.test" } } },
    }),
    prisma.user.deleteMany({
      where: { email: { endsWith: "@e2e.test" } },
    }),
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}