"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FileText, MapPin, UserRound, Building2, AlertCircle, LogIn } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ورود | جابینو" };

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
      if (signInError.status === 429) {
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
                icon: <FileText className="h-4 w-4" />,
              },
              {
                text: "دسترسی به جدیدترین آگهی‌ها",
                icon: <MapPin className="h-4 w-4" />,
              },
              {
                text: "مدیریت پروفایل و رزومه",
                icon: <UserRound className="h-4 w-4" />,
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
                    <Building2 className="h-4 w-4 text-gold" />
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
                <PasswordInput
                  id="login-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={inputCls}
                />
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger-dark">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
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
                    <LogIn className="h-4 w-4 -scale-x-100" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            با ورود به جابینو،{" "}
            <Link
              href="/terms"
              className="font-semibold text-ink underline-offset-4 transition hover:text-gold hover:underline focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-gold/25"
            >
              قوانین
            </Link>{" "}
            و{" "}
            <Link
              href="/privacy"
              className="font-semibold text-ink underline-offset-4 transition hover:text-gold hover:underline focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-gold/25"
            >
              حریم خصوصی
            </Link>{" "}
            را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}