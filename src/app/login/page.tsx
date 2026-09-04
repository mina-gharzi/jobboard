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
      setError(signInError.message ?? "ورود انجام نشد");
      return;
    }

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>ورود</h1>

      <input placeholder="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}