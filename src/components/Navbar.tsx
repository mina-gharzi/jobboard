import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/" className="text-lg font-bold text-gray-900">
        Job Board
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/jobs" className="text-gray-700 hover:text-gray-900">
          آگهی‌ها
        </Link>

        {session?.user.role === "EMPLOYER" && (
          <>
            <Link href="/employer" className="text-gray-700 hover:text-gray-900">
              داشبورد من
            </Link>
            <Link href="/employer/new" className="text-gray-700 hover:text-gray-900">
              ثبت آگهی
            </Link>
          </>
        )}

        {session?.user.role === "CANDIDATE" && (
          <Link href="/candidate" className="text-gray-700 hover:text-gray-900">
            درخواست‌های من
          </Link>
        )}

        {!session && (
          <>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              ورود
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              ثبت‌نام
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}