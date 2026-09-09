"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "ثبت‌نام انجام نشد");
      return;
    }

    setRegistered(true);
  }

  const inputCls =
    "w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10";

  const roleBtn = (value: "CANDIDATE" | "EMPLOYER", active: boolean) =>
    `flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 text-center transition ${
      active
        ? "border-gold bg-gold/10 shadow-[0_12px_24px_-16px_rgba(194,165,109,0.6)]"
        : "border-ink/10 bg-white/60 hover:border-gold/30"
    }`;

  if (registered) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center md:py-28">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </span>

          <h1 className="mt-7 text-2xl font-black text-ink md:text-3xl">
            تایید ایمیل
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-ink-muted">
            یک ایمیل تایید برای{" "}
            <span className="font-semibold text-ink">{email}</span> ارسال شد.
            برای فعال‌سازی کامل حساب کاربری، روی لینک داخل ایمیل کلیک کنید.
          </p>

          <button
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
            className="mt-8 flex items-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-sm font-bold text-paper shadow-[0_16px_40px_-16px_rgba(44,57,71,0.5)] transition hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0"
          >
            بازگشت به صفحه‌ی اصلی
            <svg className="h-4 w-4 -scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* decorative bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-20 lg:grid-cols-2 lg:gap-16">
        {/* ── پنل برندینگ ── */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs font-bold text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            ثبت‌نام رایگان
          </span>
          <h1 className="mt-6 text-4xl font-black leading-snug text-ink xl:text-5xl">
            مسیر شغلی حرفه‌ای
            <span className="block bg-linear-to-l from-gold via-gold-hover to-gold bg-clip-text text-transparent">
              از این‌جا آغاز می‌شود.
            </span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-8 text-ink-muted md:text-base">
            در چند ثانیه حساب کاربری بسازید؛ چه به دنبال شغل باشید و چه به
            دنبال نیروی متخصص، تمام امکانات لازم در همین‌جا فراهم است.
          </p>

          <div className="mt-10 flex flex-col gap-3.5">
            {[
              {
                text: "ارسال درخواست‌ها با یک کلیک",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                ),
              },
              {
                text: "پروفایل حرفه‌ای و رزومه",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8M16 17H8M10 9H8" />
                  </svg>
                ),
              },
              {
                text: "دسترسی به آگهی‌های به‌روز",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-ink">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── فرم ثبت‌نام ── */}
        <div className="mx-auto w-full max-w-md lg:my-auto">
          <div className="rounded-[32px] border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-9">
            <div className="lg:hidden">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink">
                  <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                    <path d="M9 9h2M9 13h2M9 17h2" />
                    <path d="M14 9h2M14 13h2M14 17h2" />
                  </svg>
                </span>
                جابینو
              </span>
            </div>

            <div className="mb-7 mt-2 lg:mt-0">
              <h1 className="text-2xl font-black text-ink md:text-3xl">ثبت‌نام</h1>
              <p className="mt-2 text-sm text-ink-muted">
                قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link href="/login" className="font-bold text-gold hover:text-gold-hover">
                  وارد شوید
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* انتخاب نقش */}
              <div className="grid grid-cols-2 gap-3">
                <label className={roleBtn("CANDIDATE", role === "CANDIDATE")}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "CANDIDATE"}
                    onChange={() => setRole("CANDIDATE")}
                    className="sr-only"
                  />
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${role === "CANDIDATE" ? "bg-gold text-ink" : "bg-ink/5 text-ink-muted"}`}>
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M4.5 20c1.6-3.5 4.6-5.5 7.5-5.5s5.9 2 7.5 5.5" />
                    </svg>
                  </span>
                  <span className={`text-sm font-bold ${role === "CANDIDATE" ? "text-ink" : "text-ink-muted"}`}>
                    کارجو هستم
                  </span>
                </label>

                <label className={roleBtn("EMPLOYER", role === "EMPLOYER")}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "EMPLOYER"}
                    onChange={() => setRole("EMPLOYER")}
                    className="sr-only"
                  />
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${role === "EMPLOYER" ? "bg-gold text-ink" : "bg-ink/5 text-ink-muted"}`}>
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                      <path d="M9 9h2M9 13h2M9 17h2" />
                      <path d="M14 9h2M14 13h2M14 17h2" />
                    </svg>
                  </span>
                  <span className={`text-sm font-bold ${role === "EMPLOYER" ? "text-ink" : "text-ink-muted"}`}>
                    کارفرما هستم
                  </span>
                </label>
              </div>

              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  نام و نام خانوادگی
                </label>
                <input
                  id="register-name"
                  placeholder="مثلاً علی رضایی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  ایمیل
                </label>
                <input
                  id="register-email"
                  placeholder="example@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  رمز عبور
                </label>
                <input
                  id="register-password"
                  placeholder="حداقل ۸ کاراکتر"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="register-confirm" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  تکرار رمز عبور
                </label>
                <input
                  id="register-confirm"
                  placeholder="تکرار رمز عبور"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger-dark">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-sm font-bold text-paper shadow-[0_16px_40px_-16px_rgba(44,57,71,0.5)] transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_20px_48px_-16px_rgba(44,57,71,0.6)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4z" />
                    </svg>
                    در حال ثبت‌نام...
                  </>
                ) : (
                  <>
                    ثبت‌نام
                    <svg className="h-4 w-4 -scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            با ثبت‌نام،{" "}
            <span className="text-ink underline underline-offset-2">قوانین</span> و{" "}
            <span className="text-ink underline underline-offset-2">حریم خصوصی</span> را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}