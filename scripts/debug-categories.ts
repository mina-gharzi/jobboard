import { PrismaClient } from "../src/generated/prisma";
import { JOB_CATEGORIES } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany({
    select: { id: true, title: true, category: true, status: true },
  });

  console.log(`\nتعداد کل آگهی‌ها: ${jobs.length}\n`);

  console.log("── وضعیت‌ها ──");
  const statusCount: Record<string, number> = {};
  for (const j of jobs) statusCount[j.status] = (statusCount[j.status] ?? 0) + 1;
  console.table(statusCount);

  console.log("── دسته‌بندی‌های ذخیره‌شده در دیتابیس ──");
  const catCount: Record<string, number> = {};
  for (const j of jobs) catCount[j.category] = (catCount[j.category] ?? 0) + 1;
  console.table(catCount);

  console.log("── مقایسه با لیست JOB_CATEGORIES ──");
  const validSet = new Set<string>(JOB_CATEGORIES as readonly string[]);
  for (const cat of Object.keys(catCount)) {
    const match = validSet.has(cat);
    console.log(
      `${match ? "✅ مچ" : "❌ عدم تطابق"}  |  "${cat}"  (طول: ${cat.length}, کدهای یونیکد: ${[...cat].map((c) => c.charCodeAt(0)).join(",")})`
    );
  }

  console.log("\n── برای مقایسه، مقادیر معتبر داخل categories.ts ──");
  for (const cat of JOB_CATEGORIES) {
    console.log(`"${cat}"  (طول: ${cat.length}, کدهای یونیکد: ${[...cat].map((c) => c.charCodeAt(0)).join(",")})`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
