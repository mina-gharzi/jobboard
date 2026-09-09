import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendResetPasswordEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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