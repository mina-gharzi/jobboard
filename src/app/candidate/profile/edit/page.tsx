import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "../ProfileForm";

export default async function CandidateProfileEditPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "CANDIDATE") redirect("/jobs");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      phone: true,
      resumeUrl: true,
      bio: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <Link
          href="/candidate/profile"
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
          بازگشت به پروفایل
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          <div>
            <h1 className="text-xl font-black text-ink">ویرایش پروفایل</h1>
            <p className="mt-0.5 text-sm text-ink-muted">
              تغییرات هنگام اپلای در اختیار کارفرما قرار می‌گیرد.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-8">
          <ProfileForm
            phone={user.phone ?? ""}
            resumeUrl={user.resumeUrl ?? ""}
            bio={user.bio ?? ""}
            startEditing
          />
        </div>
      </div>
    </div>
  );
}