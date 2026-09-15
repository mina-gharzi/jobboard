import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// نگاشت مقادیر قدیمی (انگلیسی) به مقادیر جدید (فارسی، مطابق src/lib/categories.ts)
const CATEGORY_MIGRATION_MAP: Record<string, string> = {
  "Frontend": "فرانت‌اند",
  "Backend": "بک‌اند",
  "Full Stack": "فول‌استک",
  "Mobile": "موبایل",
  "DevOps": "دواپس",
  "Design": "طراحی محصول (UI/UX)",
  "UI/UX": "طراحی محصول (UI/UX)",
  "QA": "تضمین کیفیت (QA)",
  "Data": "دیتا و هوش مصنوعی",
  // اگه مقادیر قدیمی دیگه‌ای هم پیدا شد (مثلاً برای "مدیریت محصول" یا "پشتیبانی فنی")
  // یه خط مشابه بالا اینجا اضافه کن.
};

async function main() {
  console.log("── شروع migration دسته‌بندی‌ها ──\n");

  let totalUpdated = 0;

  for (const [oldValue, newValue] of Object.entries(CATEGORY_MIGRATION_MAP)) {
    const result = await prisma.job.updateMany({
      where: { category: oldValue },
      data: { category: newValue },
    });

    if (result.count > 0) {
      console.log(`✅ "${oldValue}" → "${newValue}"   (${result.count} آگهی به‌روزرسانی شد)`);
      totalUpdated += result.count;
    } else {
      console.log(`⏭️  "${oldValue}" → موردی پیدا نشد`);
    }
  }

  console.log(`\nمجموع آگهی‌های به‌روزرسانی‌شده: ${totalUpdated}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
