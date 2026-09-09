import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendResetPasswordEmail, sendVerificationEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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