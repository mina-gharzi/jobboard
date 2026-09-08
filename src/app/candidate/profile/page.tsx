import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

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
      resumeUrl: true,
      bio: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/candidate" className="text-sm text-ink-muted hover:text-ink">
        ← بازگشت به درخواست‌های من
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">پروفایل من</h1>
      <p className="mt-1 text-sm text-ink-muted">
        این اطلاعات هنگام اپلای، در اختیار کارفرما قرار می‌گیرد؛ کامل بودنش شانس دیده‌شدنت را بیشتر می‌کند.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-white/70 p-6">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-sm text-ink-muted">{user.email}</p>
          </div>
        </div>

        <ProfileForm
          phone={user.phone ?? ""}
          resumeUrl={user.resumeUrl ?? ""}
          bio={user.bio ?? ""}
        />
      </div>
    </div>
  );
}
