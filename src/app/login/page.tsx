"use client";

import { useState } from "react";
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
          "ایمیل شما هنوز تایید نشده. یک ایمیل تایید تازه براتون ارسال شد؛ لطفاً صندوق ورودی (یا اسپم) را بررسی کنید."
        );
      } else {
        setError(signInError.message ?? "ورود انجام نشد");
      }
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">ورود</h1>

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
        <input
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="input-field rounded-md border p-3 text-sm"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <a
          href="/forgot-password"
          className="-mt-2 self-end text-xs text-ink-muted underline"
        >
          فراموشی رمز عبور؟
        </a>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}