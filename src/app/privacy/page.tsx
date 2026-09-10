import Link from "next/link";
import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حریم خصوصی | جابینو",
  description: "سیاست حریم خصوصی و نحوه‌ی جمع‌آوری و استفاده از داده‌ها در پلتفرم جابینو",
};

const sections = [
  {
    title: "۱. اطلاعاتی که جمع‌آوری می‌کنیم",
    body: "برای ارائه‌ی سرویس، اطلاعاتی مانند نام، ایمیل، شماره تماس، نقش کاربری (کارفرما/کارجو)، اطلاعات پروفایل (از جمله رزومه و توضیحات) و نیز آگهی‌ها و درخواست‌های ثبت‌شده را نگهداری می‌کنیم. این اطلاعات توسط خود شما هنگام استفاده از سرویس وارد می‌شوند.",
  },
  {
    title: "۲. نحوه‌ی استفاده از اطلاعات",
    body: "از این اطلاعات برای برقراری ارتباط میان کارفرما و کارجو، مدیریت حساب کاربری، پیگیری وضعیت درخواست‌ها، بهبود کیفیت سرویس و ارسال اطلاع‌رسانی‌های ضروری استفاده می‌کنیم. داده‌های شما را برای هدفی غیر از موارد بالا بدون رضایت شما استفاده نمی‌کنیم.",
  },
  {
    title: "۳. اشتراک‌گذاری",
    body: "رزومه و اطلاعات پروفایل شما (نقش کارجو) فقط در اختیار کارفرمای آگهی‌ای قرار می‌گیرد که برای آن درخواست ثبت کرده‌اید. مشخصات شرکت و آگهی شما (نقش کارفرما) به‌صورت عمومی در سرویس نمایش داده می‌شود. داده‌های شما به اشخاص ثالث فروخته نمی‌شود.",
  },
  {
    title: "۴. رزومه و مدارک",
    body: "فایل‌های رزومه‌ی بارگذاری‌شده به‌صورت امن در فضای ابری ذخیره می‌شوند و دسترسی به آن‌ها فقط از طریق حساب کاربری شما یا کارفرمایانی که برای آگهی‌شان اپلای کرده‌اید ممکن است. این فایل‌ها از محیط عمومی جدا نگهداری می‌شوند.",
  },
  {
    title: "۵. امنیت",
    body: "برای محافظت از داده‌ها از رمزنگاری هنگام انتقال و کنترل دسترسی مبتنی بر حساب استفاده می‌کنیم. هیچ سامانه‌ای به‌طور کامل ایمن نیست، اما ما تلاش می‌کنیم با بهترین شیوه‌های رایج، داده‌های شما را محافظت کنیم.",
  },
  {
    title: "۶. کوکی‌ها و نشست",
    body: "برای حفظ وضعیت ورود و عملکرد صحیح سرویس از کوکی‌ها استفاده می‌کنیم. می‌توانید کوکی‌ها را در مرورگر خود مدیریت یا حذف کنید؛ اما برخی امکانات (مانند ماندن در حالت ورود) ممکن است بدرستی عمل نکنند.",
  },
  {
    title: "۷. حقوق شما",
    body: "شما می‌توانید اطلاعات پروفایل خود را هر زمان از بخش «پروفایل» ویرایش کنید، نسبت به دریافت نسخه‌ای از داده‌های خود درخواست دهید یا حذف حساب را از طریق پشتیبانی دنبال کنید.",
  },
  {
    title: "۸. تغییرات سیاست",
    body: "هر تغییر در این سیاست در همین صفحه منتشر می‌شود. ادامه‌ی استفاده از سرویس پس از انتشار تغییرات به‌معنای پذیرش آن‌هاست.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl text-sm font-medium text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur transition group-hover:border-gold/30 group-hover:bg-gold/5">
            <ChevronRight className="h-4 w-4 -scale-x-100" />
          </span>
          بازگشت
        </Link>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-line bg-white/70 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur">
          {/* هدر */}
          <div className="relative border-b border-line bg-linear-to-l from-gold/10 via-gold/4 to-transparent px-6 py-8 md:px-10 md:py-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.7)]">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-black text-ink md:text-3xl">
              حریم خصوصی
            </h1>
            <p className="mt-2 text-sm leading-7 text-ink-muted">
              آخرین بازبینی: شهریور ۱۴۰۵
            </p>
          </div>

          {/* بخش‌ها */}
          <div className="divide-y divide-line/70 px-6 py-4 md:px-10">
            {sections.map((section) => (
              <section key={section.title} className="py-5">
                <h2 className="font-display text-base font-bold text-ink">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-8 text-ink/80">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
          <FileText className="h-4 w-4 text-gold" />
          برای شرایط استفاده از سرویس، صفحه‌ی
          <Link
            href="/terms"
            className="font-semibold text-ink underline-offset-4 transition hover:text-gold hover:underline"
          >
            قوانین
          </Link>
          را ببینید.
        </p>
      </div>
    </div>
  );
}