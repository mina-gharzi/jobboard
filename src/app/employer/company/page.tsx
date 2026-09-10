import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import CompanyProfileForm from "./CompanyProfileForm";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "شرکت | جابینو" };

export default async function CompanyProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      companyDescription: true,
      companyWebsite: true,
      companyTeamSize: true,
    },
  });

  if (!profile) redirect("/login");

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 md:px-10 md:pt-16">
        {/* بازگشت به داشبورد */}
        <Link
          href="/employer"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <ChevronRight className="h-4 w-4 -scale-x-100 transition-transform group-hover:translate-x-0.5" />
          بازگشت به داشبورد
        </Link>

        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold md:text-sm">
            <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
            پنل کارفرما
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-3xl">
            پروفایل شرکت
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            اطلاعات شرکت خود را کامل کنید تا کارجوها بهتر با شما آشنا شوند.
          </p>
        </header>

        <CompanyProfileForm
          name={profile.name ?? ""}
          email={profile.email ?? ""}
          logoUrl={profile.image ?? ""}
          companyDescription={profile.companyDescription ?? ""}
          companyWebsite={profile.companyWebsite ?? ""}
          companyTeamSize={profile.companyTeamSize ?? ""}
        />
      </div>
    </div>
  );
}