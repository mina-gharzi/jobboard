import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="mb-3 text-sm text-ink-muted">تابلوی مشاغل — نسخه‌ی یک</p>
      <h1 className="font-display text-4xl font-bold leading-snug text-ink">
        فرصت بعدی‌ات را اینجا اعلام کن،
        <br />
        یا پیدایش کن.
      </h1>
      <p className="mt-5 max-w-md text-ink-muted leading-8">
        کارفرماها آگهی می‌ذارن، کارجوها اپلای می‌کنن، و هر دو طرف می‌دونن الان کجای مسیر هستن.
      </p>

      <div className="mt-9 flex items-center gap-6 border-t-2 border-ink pt-6">
        <Link href="/jobs" className="font-medium text-ink hover:text-gold">
          مشاهده‌ی آگهی‌ها ↗
        </Link>

        {!session && (
          <Link href="/register" className="text-gold hover:underline">
            ثبت‌نام رایگان
          </Link>
        )}
        {session?.user.role === "EMPLOYER" && (
          <Link href="/employer/new" className="text-gold hover:underline">
            ثبت آگهی جدید
          </Link>
        )}
        {session?.user.role === "CANDIDATE" && (
          <Link href="/candidate" className="text-gold hover:underline">
            درخواست‌های من
          </Link>
        )}
      </div>
    </div>
  );
}