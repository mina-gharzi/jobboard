import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { JOB_CATEGORIES } from "@/lib/categories";
import HeroSection from "@/components/home/HeroSection";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import LatestJobs from "@/components/home/LatestJobs";
import WhyJabino from "@/components/home/WhyJabino";
import CtaSection from "@/components/home/CtaSection";

export default async function Home() {
  let session = null;
  let jobCount = 0;
  let employerCount = 0;
  let candidateCount = 0;
  let sortedCategories: string[] = [];
  let categoryCounts: Array<{ category: string; count: number }> = [];
  let recentJobs: Array<{ id: string; slug: string; title: string; category: string; city: string; remoteType: string; salaryMin: number | null; salaryMax: number | null; createdAt: Date; employer?: { name: string | null; image: string | null } | null; }> = [];

  try { session = await auth.api.getSession({ headers: await headers() }); } catch {}

  try {
    const [jobCountResult, employerGroups, candidateCountResult, categoryGroups, recentJobsResult] = await Promise.all([
      prisma.job.count({ where: { status: "PUBLISHED" } }),
      prisma.job.groupBy({ by: ["employerId"], where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.job.groupBy({ by: ["category"], where: { status: "PUBLISHED", category: { in: [...JOB_CATEGORIES] } }, _count: { category: true } }),
      prisma.job.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, slug: true, title: true, category: true, city: true, remoteType: true, salaryMin: true, salaryMax: true, createdAt: true, employer: { select: { name: true, image: true } } } }),
    ]);
    jobCount = jobCountResult;
    employerCount = employerGroups.length;
    candidateCount = candidateCountResult;
    recentJobs = recentJobsResult;
    categoryCounts = categoryGroups
      .map((c: { category: string; _count: { category: number } }) => ({ category: c.category, count: c._count.category }))
      .sort((a, b) => (JOB_CATEGORIES as readonly string[]).indexOf(a.category) - (JOB_CATEGORIES as readonly string[]).indexOf(b.category));
    sortedCategories = categoryCounts.map((c) => c.category);
  } catch {}

  return (
    <main className="overflow-hidden">
      <HeroSection jobCount={jobCount} employerCount={employerCount} candidateCount={candidateCount} chipCategories={sortedCategories.slice(0, 5)} />
      <CategoriesGrid categories={categoryCounts.slice(0, 10)} />
      <LatestJobs jobs={recentJobs} />
      <WhyJabino />
      <CtaSection session={session} />
    </main>
  );
}