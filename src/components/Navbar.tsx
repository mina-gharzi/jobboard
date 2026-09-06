import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <nav className="bg-paper/80 backdrop-blur-md border-b border-line sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* لوگو */}
        <Link
          href="/"
          className="font-display text-xl font-bold text-ink hover:text-slate transition-colors"
        >
          جابینو
        </Link>

        {/* لینک‌ها */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/jobs"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            آگهی‌ها
          </Link>

          {session?.user.role === "EMPLOYER" && (
            <>
              <Link
                href="/employer"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                داشبورد من
              </Link>
              <Link
                href="/employer/new"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                ثبت آگهی
              </Link>
            </>
          )}

          {session?.user.role === "CANDIDATE" && (
            <Link
              href="/candidate"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              درخواست‌های من
            </Link>
          )}

          {!session && (
            <>
              <Link
                href="/login"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                ورود
              </Link>
              <Link
                href="/register"
                className="bg-gold hover:bg-gold-hover text-ink px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ثبت‌نام
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
