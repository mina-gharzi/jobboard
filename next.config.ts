import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // آپلود رزومه (PDF تا ۵ مگابایت) از طریق Server Actions انجام می‌شود؛
  // محدودیت پیش‌فرض بدنه ۱ مگابایت است و باید بزرگ‌تر شود.
  serverActions: {
    bodySizeLimit: "8mb",
  },
};

export default nextConfig;