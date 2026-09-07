import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NewJobForm from "./NewJobForm";

export default async function NewJobPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-ink">ثبت آگهی جدید</h1>
      <p className="mt-1 text-sm text-ink-muted">
        اطلاعات زیر برای همه‌ی کارجوها قابل‌مشاهده خواهد بود.
      </p>

      <NewJobForm />
    </div>
  );
}
