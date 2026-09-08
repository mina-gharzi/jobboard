import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/jobs`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // نکته: مدل Job فیلد updatedAt نداره، پس از createdAt به‌عنوان
  // lastModified استفاده می‌کنیم؛ برای آگهی‌های ویرایش‌شده دقیق نیست ولی
  // بهتر از نداشتنشه.
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.createdAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...jobRoutes];
}
