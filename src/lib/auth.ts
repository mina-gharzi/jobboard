import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
      resumeUrl: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
});