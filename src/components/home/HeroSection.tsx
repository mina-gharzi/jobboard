"use client";

import Link from "next/link";
import {
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Search,
  Users,
} from "lucide-react";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

type Props = {
  jobCount: number;
  employerCount: number;
  candidateCount: number;
  chipCategories: string[];
};

export default function HeroSection({
  jobCount,
  employerCount,
  candidateCount,
  chipCategories,
}: Props) {
  const stats = [
    {
      label: "فرصت شغلی",
      value: formatNumber(jobCount),
      icon: <Briefcase className="h-5 w-5" />,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "شرکت فعال",
      value: formatNumber(employerCount),
      icon: <Building2 className="h-5 w-5" />,
      color: "text-slate-dark",
      bg: "bg-slate/8",
    },
    {
      label: "کارجو",
      value: formatNumber(candidateCount),
      icon: <Users className="h-5 w-5" strokeWidth={1.8} />,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center mesh-gradient">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold/8 blur-[100px] animate-morph" />
        <div className="absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-slate/6 blur-[100px] animate-morph" style={{ animationDelay: "4s" }} />
        <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gold/4 blur-[80px]" />

        <div className="absolute right-[8%] top-[12%] hidden lg:block">
          <div className="h-20 w-20 animate-rotate-slow rounded-full border border-gold/15" />
        </div>

        <div className="absolute right-[12%] top-[18%] hidden h-14 w-14 rotate-12 rounded-2xl border border-gold/20 bg-white/40 shadow-lg backdrop-blur-sm lg:block animate-float">
          <Briefcase className="m-3 h-8 w-8 text-gold/50" strokeWidth={1.5} />
        </div>
        <div className="absolute left-[10%] top-[30%] hidden h-12 w-12 rounded-full border border-slate/20 bg-white/40 shadow-lg backdrop-blur-sm lg:block animate-float-slow">
          <Clock className="m-3 h-6 w-6 text-slate-dark/40" strokeWidth={1.8} />
        </div>
        <div className="absolute bottom-[28%] right-[30%] hidden h-10 w-10 rounded-xl bg-gold/10 shadow-lg backdrop-blur-sm lg:block animate-float-delayed" />
        <div className="absolute bottom-[22%] left-[18%] hidden h-8 w-8 rounded-full border-2 border-dashed border-gold/25 lg:block animate-float-slow" />
        <div className="absolute left-[30%] top-[10%] hidden h-6 w-6 rounded-md border border-slate/15 bg-white/30 lg:block animate-float-delayed" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full border border-gold/20 bg-white/60 px-5 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="h-3.5 w-px bg-gold/30" />
            بستر تخصصی استخدام در ایران
          </span>

          <h1 className="mt-10 text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="animate-fade-in-up-delay-1 block">
              فرصت‌ها را پیدا کنید.
            </span>
            <span className="animate-fade-in-up-delay-2 mt-3 block bg-linear-to-l from-gold via-gold-hover to-gold bg-clip-text text-transparent">
              آینده را بسازید.
            </span>
          </h1>

          <p className="animate-fade-in-up-delay-2 mx-auto mt-7 max-w-2xl text-sm leading-8 text-ink-muted md:text-lg md:leading-9">
            صدها فرصت شغلی در حوزه‌های مختلف فناوری و مدیریت؛
            <br className="hidden md:block" />
            از استارتاپ‌های نوپا تا شرکت‌های بزرگ.
          </p>

          <div className="animate-fade-in-up-delay-3 mt-10 rounded-[2rem] border border-white/50 bg-white/70 p-2.5 shadow-[0_24px_80px_-24px_rgba(44,57,71,0.2)] backdrop-blur-2xl">
            <form action="/jobs" method="GET">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_0.85fr_auto]">
                <label className="group flex min-h-16 cursor-text items-center gap-3 rounded-[1.5rem] border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                  <Search className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                  <input type="text" name="q" placeholder="عنوان شغل، مهارت یا کلمه کلیدی" aria-label="عنوان شغل، مهارت یا کلمه کلیدی" className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none" />
                </label>
                <label className="group flex min-h-16 cursor-text items-center gap-3 rounded-[1.5rem] border border-transparent bg-transparent px-5 transition focus-within:border-gold/30 focus-within:bg-paper/70 focus-within:ring-4 focus-within:ring-gold/10">
                  <MapPin className="h-5 w-5 shrink-0 text-ink-muted transition-colors group-focus-within:text-gold" />
                  <input type="text" name="city" placeholder="شهر" aria-label="شهر" className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none" />
                </label>
                <button type="submit" className="group flex min-h-16 items-center justify-center gap-2.5 rounded-[1.5rem] bg-ink px-8 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_16px_32px_-12px_rgba(44,57,71,0.5)] active:translate-y-0">
                  <Search className="h-4 w-4" />
                  جستجوی شغل
                </button>
              </div>
            </form>
          </div>

          {chipCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-ink-muted/70">پرطرفدار:</span>
              {chipCategories.map((category) => (
                <Link key={category} href={`/jobs?category=${encodeURIComponent(category)}`} className="rounded-full border border-ink/8 bg-white/45 px-3.5 py-1.5 text-ink-muted backdrop-blur-md transition hover:-translate-y-0.5 hover:border-gold/35 hover:bg-gold/5 hover:text-ink hover:shadow-[0_8px_16px_-8px_rgba(194,165,109,0.4)]">
                  {category}
                </Link>
              ))}
            </div>
          )}

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`group glass-card rounded-2xl p-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(44,57,71,0.15)] md:p-5 animate-slide-up-${i + 1}`}>
                <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="mt-3 text-xl font-black text-ink md:text-2xl">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-muted md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-paper to-transparent" />
    </section>
  );
}