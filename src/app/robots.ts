import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // داشبورد کارجو/کارفرما و مسیرهای auth خصوصی‌ان و ارزشی برای
        // ایندکس شدن ندارن.
        disallow: ["/candidate", "/employer", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
