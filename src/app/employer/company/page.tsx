import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import CompanyProfileForm from "./CompanyProfileForm";

export default async function CompanyProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/candidate");

  const user = await prisma.user.findUnique({
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

  if (!user) redirect("/login");

  return (
    <div className="relative overflow-hidden">
      {/* decorative bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-20 pt-10 md:px-10 md:pt-16">
        {/* back link */}
        <Link
          href="/employer"
          className="group inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur transition group-hover:border-gold/30 group-hover:bg-gold/5">
            <svg
              className="h-4 w-4 -scale-x-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </span>
          بازگشت به داشبورد
        </Link>

        <CompanyProfileForm
          email={user.email}
          name={user.name}
          logoUrl={user.image ?? ""}
          companyDescription={user.companyDescription ?? ""}
          companyWebsite={user.companyWebsite ?? ""}
          companyTeamSize={user.companyTeamSize ?? ""}
        />
      </div>
    </div>
  );
}