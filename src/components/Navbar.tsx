import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <nav className="border-b-2 border-ink px-6 py-5">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-ink">
          تابلوی مشاغل
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/jobs" className="text-ink hover:text-gold">
            آگهی‌ها
          </Link>

          {session?.user.role === "EMPLOYER" && (
            <>
              <Link href="/employer" className="text-ink hover:text-gold">
                داشبورد من
              </Link>
              <Link href="/employer/new" className="text-ink hover:text-gold">
                ثبت آگهی
              </Link>
            </>
          )}

          {session?.user.role === "CANDIDATE" && (
            <Link href="/candidate" className="text-ink hover:text-gold">
              درخواست‌های من
            </Link>
          )}

          {!session && (
            <>
              <Link href="/login" className="text-ink hover:text-gold">
                ورود
              </Link>
              <Link
                href="/register"
                className="border-b-2 border-gold pb-0.5 font-medium text-gold"
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