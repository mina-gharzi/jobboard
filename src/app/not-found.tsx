import Link from "next/link";
import { Compass, SearchX } from "lucide-react";
import { LogoMark } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink shadow-[0_16px_40px_-12px_rgba(44,57,71,0.5)]">
          <LogoMark className="h-8 w-8 text-gold" />
        </span>

        <p className="mt-6 font-display text-7xl font-black leading-none text-ink md:text-8xl">
          ۴۰۴
        </p>

        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs font-bold text-ink">
          <SearchX className="h-3.5 w-3.5" />
          صفحه‌ای که دنبال آن بودید پیدا نشد
        </span>

        <p className="mt-5 max-w-md text-sm leading-8 text-ink-muted md:text-base">
          ممکن است آدرس اشتباه باشد، آگهی حذف شده باشد یا لینک آن منقضی شده
          باشد. می‌توانید از صفحه‌ی آگهی‌ها دوباره جستجو کنید.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-ink shadow-[0_16px_40px_-16px_rgba(194,165,109,0.7)] transition hover:-translate-y-0.5 hover:bg-gold-hover active:translate-y-0"
          >
            <Compass className="h-4 w-4 -scale-x-100" />
            مشاهده‌ی آگهی‌های شغلی
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/70 px-6 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] active:translate-y-0"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}