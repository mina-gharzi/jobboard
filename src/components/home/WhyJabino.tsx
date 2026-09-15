import { Shield, Star, Target, Zap } from "lucide-react";

const features = [
  { icon: <Zap className="h-5 w-5" />, title: "سریع و ساده", description: "ثبت‌نام و ارسال درخواست در کمتر از ۲ دقیقه", color: "text-amber-600 bg-amber-50" },
  { icon: <Shield className="h-5 w-5" />, title: "امن و مطمئن", description: "اطلاعات شما کاملاً محرمانه و امن باقی می‌ماند", color: "text-emerald-600 bg-emerald-50" },
  { icon: <Star className="h-5 w-5" />, title: "رایگان برای همه", description: "ثبت‌نام، جستجو و ارسال درخواست کاملاً رایگان است", color: "text-gold bg-gold/10" },
  { icon: <Target className="h-5 w-5" />, title: "هدفمند", description: "فیلترهای دقیق برای پیدا کردن شغل مناسب شما", color: "text-sky-600 bg-sky-50" },
];

export default function WhyJabino() {
  return (
    <section className="relative border-y border-ink/5 bg-ink/[0.02] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted">
            <span className="h-px w-8 rounded-full bg-gold/40" />چرا جابینو؟<span className="h-px w-8 rounded-full bg-gold/40" />
          </span>
          <h2 className="mt-4 text-2xl font-black text-ink md:text-4xl">تجربه‌ای متفاوت از استخدام</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={feature.title} className={`group rounded-2xl border border-white/50 bg-white/60 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(44,57,71,0.12)] animate-slide-up-${i + 1}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}>{feature.icon}</div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}