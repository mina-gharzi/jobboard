"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Check, FileText, CalendarDays, Building2, UserRound, AlertCircle, LogIn } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ثبت‌نام | جابینو" };

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

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
      setError(
        signUpError.status === 429
          ? "تعداد درخواست‌های ثبت‌نام شما زیاد بوده است. لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید."
          : signUpError.message ?? "ثبت‌نام انجام نشد"
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10";

  const roleBtn = (value: "CANDIDATE" | "EMPLOYER", active: boolean) =>
    `flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 text-center transition ${
      active
        ? "border-gold bg-gold/10 shadow-[0_12px_24px_-16px_rgba(194,165,109,0.6)]"
        : "border-ink/10 bg-white/60 hover:border-gold/30"
    }`;

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
                icon: <Check className="h-4 w-4" />,
              },
              {
                text: "پروفایل حرفه‌ای و رزومه",
                icon: <FileText className="h-4 w-4" />,
              },
              {
                text: "دسترسی به آگهی‌های به‌روز",
                icon: <CalendarDays className="h-4 w-4" />,
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
                    <UserRound className="h-4.5 w-4.5" />
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
                    <Building2 className="h-4.5 w-4.5" />
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
                <PasswordInput
                  id="register-password"
                  placeholder="حداقل ۸ کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputCls}
                />
                {password.length > 0 && password.length < 8 && (
                  <p className="mt-1.5 text-xs text-danger">رمز عبور باید حداقل ۸ کاراکتر باشد</p>
                )}
              </div>

              <div>
                <label htmlFor="register-confirm" className="mb-1.5 block text-sm font-semibold text-ink-muted">
                  تکرار رمز عبور
                </label>
                <PasswordInput
                  id="register-confirm"
                  placeholder="تکرار رمز عبور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputCls}
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-danger">رمز عبور و تکرار آن یکسان نیستند</p>
                )}
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
                    در حال ثبت‌نام...
                  </>
                ) : (
                  <>
                    ثبت‌نام
                    <LogIn className="h-4 w-4 -scale-x-100" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            با ثبت‌نام،{" "}
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