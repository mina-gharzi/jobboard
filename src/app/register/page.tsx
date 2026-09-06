"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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

    router.push("/");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">ثبت‌نام</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4 rounded-lg border border-line p-3">
          <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={role === "CANDIDATE"}
              onChange={() => setRole("CANDIDATE")}
              className="accent-slate"
            />
            کارجو هستم
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={role === "EMPLOYER"}
              onChange={() => setRole("EMPLOYER")}
              className="accent-slate"
            />
            کارفرما هستم
          </label>
        </div>

        <input
          placeholder="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          placeholder="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field rounded-md border p-3 text-sm"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>
    </div>
  );
}