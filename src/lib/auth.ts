import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendResetPasswordEmail } from "./email";

export const auth = betterAuth({
  // آدرس پایه‌ی سرور برای better-auth. روی Vercel، VERCEL_URL به‌صورت
  // خودکار (هم در production و هم در preview) با آدرس واقعی همون دیپلوی
  // ست می‌شه؛ اگه NEXT_PUBLIC_APP_URL هم تنظیم شده باشه (مثلاً برای
  // دامنه‌ی اصلی production)، همون اولویت داره.
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  // origin هایی که better-auth بهشون اعتماد می‌کنه (برای جلوگیری از CSRF).
  // بدون این، درخواست‌های ثبت‌نام/لاگین از دامنه‌ای که با baseURL یکی
  // نیست (مثل preview URL های تصادفی Vercel) با خطای "Invalid origin"
  // رد می‌شن.
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Better Auth یه rate limiter داخلی داره که به‌صورت پیش‌فرض فقط در
  // production فعاله (نه در dev) و مقدار پیش‌فرضش سراسریه (۱۰۰ درخواست
  // در ۶۰ ثانیه). این‌جا صراحتاً فعالش می‌کنیم (تا رفتارش قابل پیش‌بینی
  // باشه و بین dev/prod فرق نکنه) و برای مسیرهای حساس‌تر (لاگین، ثبت‌نام،
  // فراموشی رمز) محدودیت سخت‌گیرانه‌تری می‌ذاریم تا جلوی brute-force روی
  // رمز عبور و spam کردن ایمیل بازیابی/ثبت‌نام گرفته بشه.
  //
  // نکته: storage پیش‌فرض این rate limiter در حافظه (in-memory) است؛
  // یعنی روی هاست‌های چند-instance/serverless بین درخواست‌ها به‌صورت
  // کامل به اشتراک گذاشته نمی‌شه. برای production واقعی روی چنین
  // هاستی، بعداً باید `secondaryStorage` (مثلاً Redis/Upstash) هم اضافه
  // بشه؛ فعلاً همین سطح محافظت به‌مراتب از نبودنش بهتره.
  rateLimit: {
    // در تست‌های E2E ری‌استارت مکرر سرور به‌مدت rate limit ثبت‌نام
    // (۵/۱۰ دقیقه) گیر می‌کند. این seam به سرورِ ساختِ Playwright
    // این امکان را می‌دهد که rate limiter را خاموش کند.
    enabled: process.env.DISABLE_RATE_LIMIT !== "true",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 600, max: 5 },
      "/forget-password": { window: 600, max: 3 },
    },
  },
  emailAndPassword: {
    enabled: true,
    // تایید ایمیل الزامی نیست: کاربر بلافاصله بعد از ثبت‌نام می‌تونه وارد بشه.
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ to: user.email, url });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CANDIDATE",
      },
      // فیلدهای پروفایل کارجو — اختیاری، چون کارفرماها هم از همین مدل
      // User استفاده می‌کنند و این فیلدها برایشان بی‌معنی است.
      phone: {
        type: "string",
        required: false,
      },
      resumePdf: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      // فیلدهای پروفایل شرکت — اختیاری، فقط برای کارفرماها معنا دارند؛
      // نام شرکت از همون فیلد name استفاده می‌کنه و لوگو از فیلد image.
      companyDescription: {
        type: "string",
        required: false,
      },
      companyWebsite: {
        type: "string",
        required: false,
      },
      companyTeamSize: {
        type: "string",
        required: false,
      },
    },
  },
});