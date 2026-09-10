"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "فراموشی رمز عبور | جابینو" };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: requestError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (requestError) {
      setError(
        requestError.status === 429
          ? "تعداد درخواست‌های بازیابی رمز عبور شما زیاد بوده است. لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید."
          : requestError.message ?? "درخواست ناموفق بود"
      );
      return;
    }

    // همیشه پیام موفقیت نشون می‌دیم، حتی اگه ایمیل وجود نداشته باشه؛
    // این‌طوری کسی نمی‌تونه با این فرم بفهمه چه ایمیل‌هایی تو سیستم ثبت‌نام کردن.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
        </div>
        <div className="mx-auto w-full max-w-md px-4 pb-20 pt-12 md:pt-20">
          <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-9">
            <h1 className="font-display text-2xl font-black text-ink md:text-3xl">
              ایمیل ارسال شد
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              اگر این ایمیل در سیستم ثبت شده باشد، لینک بازیابی رمز عبور برایش
              ارسال شد. صندوق ورودی (و پوشه‌ی اسپم) خود را بررسی کنید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-12 md:pt-20">
        <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-9">
          <h1 className="font-display text-2xl font-black text-ink md:text-3xl">
            فراموشی رمز عبور
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            ایمیل حساب‌تان را وارد کنید تا لینک تعیین رمز عبور جدید برایتان
            ارسال شود.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              placeholder="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-label="ایمیل"
              className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
            />

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}