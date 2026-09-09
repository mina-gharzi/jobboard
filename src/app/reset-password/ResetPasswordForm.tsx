"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setLoading(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message ?? "تغییر رمز عبور ناموفق بود");
      return;
    }

    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="رمز عبور جدید"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        aria-label="رمز عبور جدید"
        className="input-field rounded-md border p-3 text-sm"
      />
      <input
        placeholder="تکرار رمز عبور جدید"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        aria-label="تکرار رمز عبور جدید"
        className="input-field rounded-md border p-3 text-sm"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
      >
        {loading ? "در حال ثبت..." : "ثبت رمز عبور جدید"}
      </button>
    </form>
  );
}