import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        شغل بعدی‌ات را همین‌جا پیدا کن
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        پلتفرمی برای اتصال کارجوها و کارفرماها — آگهی ثبت کن، اپلای کن، و وضعیت درخواستت را دنبال کن.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/jobs"
          className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          مشاهده‌ی آگهی‌ها
        </Link>

        {!session && (
          <Link
            href="/register"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            ثبت‌نام رایگان
          </Link>
        )}

        {session?.user.role === "EMPLOYER" && (
          <Link
            href="/employer/new"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            ثبت آگهی جدید
          </Link>
        )}

        {session?.user.role === "CANDIDATE" && (
          <Link
            href="/candidate"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            درخواست‌های من
          </Link>
        )}
      </div>
    </div>
  );
}