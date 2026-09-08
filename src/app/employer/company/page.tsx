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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/employer" className="text-sm text-ink-muted hover:text-ink">
        ← بازگشت به داشبورد
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">پروفایل شرکت</h1>
      <p className="mt-1 text-sm text-ink-muted">
        این اطلاعات کنار آگهی‌هاتون به کارجوها نمایش داده می‌شه؛ کامل بودنش اعتماد بیشتری می‌سازه.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-white/70 p-6">
        <div className="mb-6 border-b border-line pb-4">
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>

        <CompanyProfileForm
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
