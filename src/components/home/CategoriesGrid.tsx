import Link from "next/link";
import { ArrowLeft, Briefcase, Code, Cpu, Gauge, Headphones, Search, Shield, Sparkles, Target, TrendingUp, Zap } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "فرانت‌اند": <Code className="h-5 w-5" />,
  "بک‌اند": <Cpu className="h-5 w-5" />,
  "فول‌استک": <Target className="h-5 w-5" />,
  "موبایل": <Zap className="h-5 w-5" />,
  "دواپس": <Gauge className="h-5 w-5" />,
  "طراحی محصول (UI/UX)": <Sparkles className="h-5 w-5" />,
  "مدیریت محصول": <TrendingUp className="h-5 w-5" />,
  "دیتا و هوش مصنوعی": <Cpu className="h-5 w-5" />,
  "تضمین کیفیت (QA)": <Shield className="h-5 w-5" />,
  "پشتیبانی فنی": <Headphones className="h-5 w-5" />,
};

const categoryGradients: Record<string, string> = {
  "فرانت‌اند": "from-sky-500/20 to-sky-600/5 border-sky-200/40 hover:border-sky-300/60",
  "بک‌اند": "from-emerald-500/20 to-emerald-600/5 border-emerald-200/40 hover:border-emerald-300/60",
  "فول‌استک": "from-violet-500/20 to-violet-600/5 border-violet-200/40 hover:border-violet-300/60",
  "موبایل": "from-amber-500/20 to-amber-600/5 border-amber-200/40 hover:border-amber-300/60",
  "دواپس": "from-teal-500/20 to-teal-600/5 border-teal-200/40 hover:border-teal-300/60",
  "طراحی محصول (UI/UX)": "from-rose-500/20 to-rose-600/5 border-rose-200/40 hover:border-rose-300/60",
  "مدیریت محصول": "from-orange-500/20 to-orange-600/5 border-orange-200/40 hover:border-orange-300/60",
  "دیتا و هوش مصنوعی": "from-indigo-500/20 to-indigo-600/5 border-indigo-200/40 hover:border-indigo-300/60",
  "تضمین کیفیت (QA)": "from-cyan-500/20 to-cyan-600/5 border-cyan-200/40 hover:border-cyan-300/60",
  "پشتیبانی فنی": "from-pink-500/20 to-pink-600/5 border-pink-200/40 hover:border-pink-300/60",
};

type Props = { categories: string[] };

export default function CategoriesGrid({ categories }: Props) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted">
            <span className="h-px w-8 rounded-full bg-gold/40" />
            دسته‌بندی شغلی
            <span className="h-px w-8 rounded-full bg-gold/40" />
          </span>
          <h2 className="mt-4 text-2xl font-black text-ink md:text-4xl">در حوزه‌ی مورد علاقه‌ات جستجو کن</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-ink-muted md:text-base">از میان ده‌ها دسته‌بندی تخصصی، شغل رویایی‌ات را پیدا کن</p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category, i) => (
              <Link key={category} href={`/jobs?category=${encodeURIComponent(category)}`} className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up-${(i % 6) + 1} ${categoryGradients[category] || "from-slate/10 to-slate/5 border-slate/20 hover:border-slate/30"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-ink transition-transform duration-300 group-hover:scale-110">
                  {categoryIcons[category] || <Briefcase className="h-5 w-5" />}
                </div>
                <p className="mt-3 text-sm font-bold text-ink leading-6">{category}</p>
                <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-white/20 blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/10 bg-white/50 p-16 text-center text-ink-muted backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Search className="h-7 w-7 text-gold" strokeWidth={1.8} />
            </div>
            هنوز دسته‌بندی‌ای موجود نیست.
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/jobs" className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-7 py-3 text-sm font-semibold text-ink shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_32px_-16px_rgba(194,165,109,0.35)]">
            مشاهده همه دسته‌بندی‌ها
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}