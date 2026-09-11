import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // آپلود رزومه (PDF تا ۵ مگابایت) از طریق Server Actions انجام می‌شود؛
  // محدودیت پیش‌فرض بدنه ۱ مگابایت است و باید بزرگ‌تر شود.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },

  // اطمینان از اینکه فایل‌های باینری Prisma Query Engine
  // در بسته‌ی نهایی سرورلس Vercel گنجانده می‌شوند
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;