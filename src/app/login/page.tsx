"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      if (signInError.code === "EMAIL_NOT_VERIFIED") {
        setError(
          "ایمیل شما هنوز تایید نشده است. یک ایمیل تایید جدید برای شما ارسال شد؛ لطفاً صندوق ورودی (یا اسپم) را بررسی کنید."
        );
      } else if (signInError.status === 429) {
        setError(
          "تعداد تلاش‌های ورود شما زیاد بوده است. لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید."
        );
      } else {
        setError(signInError.message ?? "ورود انجام نشد");
      }
      return;
    }

    router.push("/");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10";

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
            ورود به حساب کاربری
          </span>
          <h1 className="mt-6 text-4xl font-black leading-snug text-ink xl:text-5xl">
            به دنیای فرصت‌های شغلی
            <span className="block bg-linear-to-l from-gold via-gold-hover to-gold bg-clip-text text-transparent">
              خوش آمدید.
            </span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-8 text-ink-muted md:text-base">
            برای دسترسی به آگهی‌های شغلی، پیگیری درخواست‌ها و مدیریت پروفایل
            حرفه‌ای، وارد حساب کاربری خود شوید.
          </p>

          <div className="mt-10 flex flex-col gap-3.5">
            {[
              {
                text: "پیگیری وضعیت درخواست‌ها",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8M16 17H8M10 9H8" />
                  </svg>
                ),
              },
              {
                text: "دسترسی به جدیدترین آگهی‌ها",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 19 9c0 4.5-4 8-7 12z" />
                  </svg>
                ),
              },
              {
                text: "مدیریت پروفایل و رزومه",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M4.5 20c1.6-3.5 4.6-5.5 7.5-5.5s5.9 2 7.5 5.5" />
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

        {/* ── فرم ورود ── */}
        <div className="mx-auto w-full max-w-md lg:my-auto">
          <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-9">
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
              <h1 className="text-2xl font-black text-ink md:text-3xl">ورود به حساب</h1>
              <p className="mt-2 text-sm text-ink-muted">
                هنوز حساب کاربری ندارید؟{" "}
                <Link href="/register" className="font-bold text-gold hover:text-gold-hover">
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  ایمیل
                </label>
                <input
                  id="login-email"
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-semibold text-ink-muted">
                    رمز عبور
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-semibold text-ink-muted transition hover:text-gold"
                  >
                    فراموشی رمز عبور؟
                  </a>
                </div>
                <input
                  id="login-password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                    در حال ورود...
                  </>
                ) : (
                  <>
                    ورود
                    <svg className="h-4 w-4 -scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            با ورود به جابینو،{" "}
            <span className="text-ink underline underline-offset-2">قوانین</span> و{" "}
            <span className="text-ink underline underline-offset-2">حریم خصوصی</span> را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}