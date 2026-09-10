import Link from "next/link";
import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "قوانین استفاده | جابینو",
  description: "شرایط و قوانین استفاده از خدمات پلتفرم جابینو",
};

const sections = [
  {
    title: "۱. پذیرش قوانین",
    body: "با ثبت‌نام و استفاده از سرویس جابینو، شما با این قوانین موافقت می‌کنید. اگر با هیچ بخشی از آن موافق نیستید، لطفاً از استفاده از سرویس خودداری کنید. ممکن است این قوانین بازبینی شوند و تغییرات بعد از انتشار در همین صفحه لازم‌الاجرا است.",
  },
  {
    title: "۲. حساب کاربری",
    body: "برای استفاده از امکانات پلتفرم مانند ارسال آگهی، ثبت درخواست یا ذخیره‌سازی آگهی، باید یک حساب کاربری با اطلاعات صحیح بسازید. مسئولیت حفظ امنیت اطلاعات حساب (رمز عبور و نشست) بر عهده شماست. هر حساب فقط برای یک نقش (کارفرما یا کارجو) قابل استفاده است.",
  },
  {
    title: "۳. آگهی‌های استخدام",
    body: "کارفرمایان موظف‌اند فقط موقعیت‌های شغلی واقعی را منتشر کنند. ثبت آگهی‌های جعلی، تبعیض‌آمیز یا خلاف قانون ممنوع است. جابینو حق دارد آگهی‌های مغایر با این قوانین را بدون اطلاع قبلی حذف کند.",
  },
  {
    title: "۴. درخواست‌های شغلی",
    body: "ارسال درخواست برای هر آگهی صرفاً یک بار امکان‌پذیر است و اطلاعات ارسالی (از جمله رزومه) مستقیماً در اختیار کارفرمای همان آگهی قرار می‌گیرد. در ارسال اطلاعات دقت کنید؛ اصلاح یا حذف درخواست پس از ثبت به‌صورت خودکار امکان‌پذیر نیست.",
  },
  {
    title: "۵. محتوای کاربران",
    body: "شما مسئول صحت و سمت‌وسوی محتوایی هستید که منتشر می‌کنید. استفاده از محتوای پلتفرم برای اهداف غیرقانونی، سوءاستفاده، یا هرزنامه‌رسانی ممنوع است. جابینو می‌تواند محتوای خلاف این قوانین یا قوانین جاری کشور را حذف یا حساب کاربر را موقتاً معلق کند.",
  },
  {
    title: "۶. محدودیت مسئولیت",
    body: "جابینو صرفاً بستری برای ارتباط کارفرما و کارجو فراهم می‌کند و مسئولیتی در قبال صحت آگهی‌ها یا رخدادهای شغلی (مانند نتیجه‌ی مصاحبه یا استخدام) ندارد. هرگونه توافق شغلی مستقیماً میان طرفین صورت می‌گیرد.",
  },
  {
    title: "۷. تغییرات قوانین",
    body: "جابینو ممکن است این قوانین را بازبینی کند. ادامه‌ی استفاده از سرویس پس از انتشار نسخه‌ی جدید به‌معنای پذیرش تغییرات است.",
  },
  {
    title: "۸. تماس",
    body: "برای پرسش درباره‌ی این قوانین یا گزارش تخلف، از بخش ارتباط با ما در سرویس استفاده کنید.",
  },
];

export default function TermsPage() {
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
              <FileText className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-black text-ink md:text-3xl">
              قوانین استفاده
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
          <ShieldCheck className="h-4 w-4 text-gold" />
          برای اطلاع از نحوه‌ی جمع‌آوری داده‌ها، صفحه‌ی
          <Link
            href="/privacy"
            className="font-semibold text-ink underline-offset-4 transition hover:text-gold hover:underline"
          >
            حریم خصوصی
          </Link>
          را ببینید.
        </p>
      </div>
    </div>
  );
}