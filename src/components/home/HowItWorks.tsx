import { FileText, Handshake, Search } from "lucide-react";

const steps = [
  { step: "۱", icon: <FileText className="h-6 w-6" />, title: "ثبت‌نام کنید", description: "به‌صورت رایگان حساب کاربری بسازید و نقش خود را (کارجو یا کارفرما) انتخاب کنید.", color: "bg-gold/10 text-gold border-gold/20", ring: "ring-gold/15" },
  { step: "۲", icon: <Search className="h-6 w-6" />, title: "جستجو یا ثبت آگهی", description: "کارجوها فرصت شغلی پیدا کنند، کارفرمایان آگهی استخدام خود را منتشر کنند.", color: "bg-slate/8 text-slate-dark border-slate/15", ring: "ring-slate/10" },
  { step: "۳", icon: <Handshake className="h-6 w-6" />, title: "ارتباط و استخدام", description: "درخواست ارسال کنید، رزومه‌ها را بررسی کنید و تیم رویایی‌تان را بسازید.", color: "bg-emerald-50 text-emerald-600 border-emerald-200/40", ring: "ring-emerald-100" },
];

export default function HowItWorks() {
  return (
    <section className="relative border-y border-ink/5 bg-ink/[0.02] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-gold/4 blur-[100px]" />
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-slate/4 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted">
            <span className="h-px w-8 rounded-full bg-gold/40" />چطور کار می‌کند؟<span className="h-px w-8 rounded-full bg-gold/40" />
          </span>
          <h2 className="mt-4 text-2xl font-black text-ink md:text-4xl">در سه قدم شروع کنید</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className={`group relative rounded-3xl border border-white/50 bg-white/60 p-7 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(44,57,71,0.12)] animate-slide-up-${i + 2}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-black text-paper shadow-lg">{item.step}</span>
              </div>
              <div className={`mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-2xl border ring-4 ${item.color} ${item.ring} transition-transform duration-300 group-hover:scale-110`}>{item.icon}</div>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}