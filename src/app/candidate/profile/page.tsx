import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "پروفایل | جابینو" };

export default async function CandidateProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/jobs");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      resumePdf: true,
      bio: true,
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
        <Link
          href="/candidate"
          className="group inline-flex items-center gap-2 rounded-xl text-sm font-medium text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur transition group-hover:border-gold/30 group-hover:bg-gold/5">
            <ChevronRight
              className="h-4 w-4 -scale-x-100"
            />
          </span>
          بازگشت به درخواست‌های من
        </Link>

        <ProfileForm
          name={user.name}
          email={user.email}
          phone={user.phone ?? ""}
          resumePdf={user.resumePdf ?? ""}
          bio={user.bio ?? ""}
        />
      </div>
    </div>
  );
}