import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const R = 54;
const C = 2 * Math.PI * R;

function CompletionRing({ pct, filled, total }: { pct: number; filled: number; total: number }) {
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle cx="60" cy="60" r={R} className="fill-white stroke-ink/[0.06]" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={R}
          className="stroke-gold"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black leading-none text-ink">
          {pct}
          <span className="text-base font-bold text-ink-muted">٪</span>
        </span>
        <span className="mt-1 text-[11px] font-semibold text-ink-muted">
          {filled} از {total}
        </span>
      </div>
    </div>
  );
}

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

  const fields: { label: string; filled: boolean }[] = [
    { label: "لوگو", filled: Boolean(user.image) },
    { label: "وبسایت", filled: Boolean(user.companyWebsite) },
    { label: "تیم", filled: Boolean(user.companyTeamSize) },
    { label: "درباره شرکت", filled: Boolean(user.companyDescription) },
  ];
  const filledCount = fields.filter((f) => f.filled).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  const initial = user.name?.trim()?.[0] ?? "؟";

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

        {/* ═══ profile card ═══ */}
        <div className="mt-6 overflow-hidden rounded-[32px] border border-line bg-white/70 shadow-[0_40px_100px_-40px_rgba(44,57,71,0.28)] backdrop-blur">
          {/* tall banner */}
          <div className="relative h-44 overflow-hidden bg-linear-to-br from-slate/18 via-gold/8 to-gold/12 md:h-52">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-gold/18 blur-3xl" />
              <div className="absolute -left-16 -bottom-20 h-48 w-48 rounded-full bg-slate/12 blur-3xl" />
              <div className="absolute right-[15%] top-[20%] h-12 w-12 rotate-12 rounded-2xl border border-gold/20 bg-white/40 shadow-lg backdrop-blur-sm animate-float" />
              <div className="absolute left-[12%] bottom-[25%] h-9 w-9 rounded-full border border-dashed border-gold/30 animate-float-slow" />
              <div className="absolute left-[30%] top-[35%] h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(194,165,109,0.5)] animate-float-delayed" />
            </div>
          </div>

          <div className="relative px-6 md:px-8">
            {/* logo — big, centered */}
            <div className="flex justify-center">
              <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white bg-white text-4xl font-black text-slate-dark shadow-[0_24px_60px_-12px_rgba(44,57,71,0.35)] ring-[5px] ring-white/80">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
            </div>

            {/* company name + role */}
            <div className="mx-auto mt-4 max-w-sm text-center">
              <div className="inline-flex items-center gap-2">
                <h1 className="font-display text-2xl font-black text-ink md:text-3xl">
                  {user.name}
                </h1>
                <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[11px] font-bold text-ink">
                  کارفرما
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
            </div>

            {/* completion ring + chips */}
            <div className="mx-auto mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <CompletionRing
                pct={completionPct}
                filled={filledCount}
                total={fields.length}
              />

              <div className="flex flex-1 flex-col gap-2.5 pt-2">
                {fields.map((f) => (
                  <span
                    key={f.label}
                    className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${
                      f.filled
                        ? "border-emerald-200/60 bg-emerald-50/80 text-emerald-800"
                        : "border-ink/8 bg-ink/[0.02] text-ink-muted"
                    }`}
                  >
                    <svg
                      className={`h-5 w-5 shrink-0 ${f.filled ? "text-emerald-500" : "text-ink-muted/30"}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {f.filled ? (
                        <path d="m5 13 4 4L19 7" />
                      ) : (
                        <circle cx="12" cy="12" r="4" />
                      )}
                    </svg>
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            {/* info summary */}
            <div className="mx-auto mt-6 max-w-lg">
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    label: "وبسایت",
                    value: user.companyWebsite,
                    isLink: Boolean(user.companyWebsite),
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                        <path d="M2 12h20" />
                      </svg>
                    ),
                  },
                  {
                    label: "اندازه تیم",
                    value: user.companyTeamSize,
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    label: "درباره شرکت",
                    value: user.companyDescription,
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                        <path d="M9 9h.01M9 13h.01M9 17h.01" />
                        <path d="M15 9h.01M15 13h.01M15 17h.01" />
                      </svg>
                    ),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3.5 rounded-2xl border border-line/60 bg-paper/60 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      {row.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        {row.label}
                      </p>
                      {row.value ? (
                        row.isLink ? (
                          <a
                            href={row.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 block truncate text-sm font-medium text-slate underline-offset-4 hover:underline"
                          >
                            {row.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-ink">
                            {row.value}
                          </p>
                        )
                      ) : (
                        <p className="mt-0.5 text-sm text-ink-muted/60">—</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* edit button */}
          <div className="border-t border-line/60 bg-paper/40 px-6 py-5 backdrop-blur md:px-8">
            <Link
              href="/employer/company/edit"
              className="group inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-paper shadow-lg transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_20px_40px_-16px_rgba(44,57,71,0.5)] active:translate-y-0"
            >
              <svg className="h-4 w-4 text-gold group-hover:text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              ویرایش اطلاعات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}