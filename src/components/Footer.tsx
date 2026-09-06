import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/" className="font-display text-lg font-bold text-ink">
            جابینو
          </Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-ink-muted">
            پلتفرم آگهی‌های استخدام — جایی برای پیدا کردن فرصت شغلی بعدی‌ت.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink">لینک‌های سریع</span>
            <Link href="/jobs" className="text-ink-muted transition-colors hover:text-ink">
              آگهی‌ها
            </Link>
            <Link href="/register" className="text-ink-muted transition-colors hover:text-ink">
              ثبت‌نام
            </Link>
            <Link href="/login" className="text-ink-muted transition-colors hover:text-ink">
              ورود
            </Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink">کارفرمایان</span>
            <Link href="/employer/new" className="text-ink-muted transition-colors hover:text-ink">
              ثبت آگهی جدید
            </Link>
            <Link href="/employer" className="text-ink-muted transition-colors hover:text-ink">
              داشبورد کارفرما
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-6 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} جابینو. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
