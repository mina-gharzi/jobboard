import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

type Props = { session: { user: { role: string } } | null };

export default function CtaSection({ session }: Props) {
  return (
    <section className="relative pb-28 pt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-center shadow-[0_48px_100px_-32px_rgba(44,57,71,0.5)] md:px-16 md:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-gold/15 blur-[100px]" />
            <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold/8 blur-[100px]" />
            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-b from-white/15 to-transparent" />
            <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-b from-transparent to-white/8" />
            <div className="absolute right-[18%] top-[20%] h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(194,165,109,0.5)] animate-float" />
            <div className="absolute left-[22%] top-[30%] h-1.5 w-1.5 rounded-full bg-gold/60 shadow-[0_0_10px_1px_rgba(194,165,109,0.4)] animate-float-delayed" />
            <div className="absolute bottom-[24%] right-[28%] h-1.5 w-1.5 rounded-full bg-white/25 animate-float-slow" />
            <div className="absolute bottom-[30%] left-[15%] h-1 w-1 rounded-full bg-gold/40 animate-float" style={{ animationDelay: "1s" }} />
          </div>
          <div className="mx-auto max-w-3xl">
            <span className="animate-pulse-glow inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-5 py-2 text-xs font-semibold text-gold">
              <Sparkles className="h-3.5 w-3.5" />جابینو برای همه
            </span>
            <h2 className="mt-8 text-3xl font-black leading-[1.4] text-paper md:text-5xl md:leading-[1.35]">
              چه به دنبال کار باشید،<br />چه به دنبال نیروی جدید،<br />
              <span className="text-gradient-gold">همه‌چیز از این‌جا آغاز می‌شود.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-paper/55 md:text-base">همین حالا اولین قدم را بردارید؛ ادامه‌ی مسیر را به ما بسپارید.</p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link href="/jobs" className="rounded-2xl bg-paper px-8 py-4 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(232,237,242,0.4)] active:translate-y-0">پیدا کردن شغل</Link>
              {!session && <Link href="/register" className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0">شروع رایگان</Link>}
              {session?.user.role === "EMPLOYER" && <Link href="/employer/new" className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0">ثبت آگهی جدید</Link>}
              {session?.user.role === "CANDIDATE" && <Link href="/candidate" className="rounded-2xl bg-gold px-8 py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-16px_rgba(194,165,109,0.5)] transition hover:-translate-y-1 hover:bg-gold-hover hover:shadow-[0_24px_60px_-16px_rgba(194,165,109,0.7)] active:translate-y-0">درخواست‌های من</Link>}
            </div>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-paper/40">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold/60" />ثبت‌نام کاملاً رایگان</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold/60" />آگهی‌های به‌روز</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold/60" />بدون واسطه</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold/60" />پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}