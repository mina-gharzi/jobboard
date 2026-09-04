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
      role, // فیلد اضافه‌ای که تو auth.ts تعریف کردیم
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "ثبت‌نام انجام نشد");
      return;
    }

    router.push("/"); // فعلاً به صفحه‌ی اصلی، بعداً به داشبورد مخصوص نقش می‌فرستیمش
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>ثبت‌نام</h1>

      <div>
        <label>
          <input type="radio" checked={role === "CANDIDATE"} onChange={() => setRole("CANDIDATE")} />
          کارجو هستم
        </label>
        <label>
          <input type="radio" checked={role === "EMPLOYER"} onChange={() => setRole("EMPLOYER")} />
          کارفرما هستم
        </label>
      </div>

      <input placeholder="نام" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
    </form>
  );
}