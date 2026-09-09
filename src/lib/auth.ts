import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendResetPasswordEmail, sendVerificationEmail } from "./email";

export const auth = betterAuth({
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
    enabled: true,
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
    // تا وقتی کاربر ایمیلش رو تایید نکرده، اجازه‌ی ورود نداره؛ صفحه‌ی
    // لاگین همین الان هم کد خطای EMAIL_NOT_VERIFIED رو مدیریت می‌کنه،
    // پس این پرچم باید true باشه تا اون مسیر واقعاً فعال بشه.
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ to: user.email, url });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ to: user.email, url });
    },
    // ایمیل تایید بلافاصله بعد از ثبت‌نام ارسال بشه (همون چیزی که صفحه‌ی
    // ثبت‌نام به کاربر وعده می‌ده: «یک ایمیل تایید برایتان ارسال شد»).
    sendOnSignUp: true,
    // بعد از کلیک روی لینک تایید، کاربر خودکار لاگین بشه تا مجبور نباشه
    // دوباره ایمیل/رمز عبور رو وارد کنه.
    autoSignInAfterVerification: true,
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