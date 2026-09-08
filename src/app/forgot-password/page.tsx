"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

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
      setError(requestError.message ?? "درخواست ناموفق بود");
      return;
    }

    // همیشه پیام موفقیت نشون می‌دیم، حتی اگه ایمیل وجود نداشته باشه؛
    // این‌طوری کسی نمی‌تونه با این فرم بفهمه چه ایمیل‌هایی تو سیستم ثبت‌نام کردن.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-12">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">
          ایمیل ارسال شد
        </h1>
        <p className="text-sm text-ink-muted">
          اگر این ایمیل در سیستم ثبت شده باشد، لینک بازیابی رمز عبور برایش
          ارسال شد. صندوق ورودی (و پوشه‌ی اسپم) خود را بررسی کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">
        فراموشی رمز عبور
      </h1>
      <p className="mb-6 text-sm text-ink-muted">
        ایمیل حساب‌تان را وارد کنید تا لینک تعیین رمز عبور جدید برایتان
        ارسال شود.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="input-field rounded-md border p-3 text-sm"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
        >
          {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </button>
      </form>
    </div>
  );
}