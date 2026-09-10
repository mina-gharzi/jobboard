import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NewJobForm from "./NewJobForm";

export default async function NewJobPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 md:px-10 md:pt-16">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold md:text-sm">
            <span className="h-px w-5 rounded-full bg-gold/40 md:w-8" />
            آگهی‌ها
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-black text-ink md:text-3xl">ثبت آگهی جدید</h1>
          <p className="mt-2 text-sm text-ink-muted">
            اطلاعات زیر برای همه‌ی کارجوها قابل‌مشاهده خواهد بود.
          </p>
        </header>

        <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-8">
          <NewJobForm />
        </div>
      </div>
    </div>
  );
}
