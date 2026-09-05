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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">ثبت‌نام</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4 rounded-lg border border-gray-200 p-3">
          <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={role === "CANDIDATE"}
              onChange={() => setRole("CANDIDATE")}
              className="accent-gray-900"
            />
            کارجو هستم
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={role === "EMPLOYER"}
              onChange={() => setRole("EMPLOYER")}
              className="accent-gray-900"
            />
            کارفرما هستم
          </label>
        </div>

        <input
          placeholder="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <input
          placeholder="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <input
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 py-3 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>
    </div>
  );
}