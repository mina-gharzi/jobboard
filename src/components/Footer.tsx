import Link from "next/link";
import { ArrowDown, Check, Heart } from "lucide-react";

const quickLinks = [
  { href: "/jobs", label: "همه آگهی‌ها" },
  { href: "/register", label: "ثبت‌نام" },
  { href: "/login", label: "ورود" },
];

const candidateLinks = [
  { href: "/candidate", label: "درخواست‌های من" },
  { href: "/candidate/profile", label: "پروفایل من" },
  { href: "/jobs", label: "جستجوی شغل" },
];

const employerLinks = [
  { href: "/employer/new", label: "ثبت آگهی جدید" },
  { href: "/employer", label: "داشبورد کارفرما" },
  { href: "/employer/company", label: "پروفایل شرکت" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3.5 text-sm">
      <span className="font-bold text-paper">{title}</span>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-paper/50 transition-colors hover:text-gold"
            >
              <span className="h-px w-0 bg-gold/60 transition-all duration-300 group-hover:w-3" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-ink text-paper">
      {/* decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-[80px]" />
        <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-slate/15 blur-[80px]" />
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>

      {/* mini CTA strip */}
      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:px-10">
          <div className="text-center md:text-right">
            <p className="font-bold text-paper">
              کارفرما هستید؟ همین حالا آگهی رایگان ثبت کنید.
            </p>
            <p className="mt-1 text-xs text-paper/50">
              جذب بهترین استعدادها را از همین امروز آغاز کنید.
            </p>
          </div>
          <Link
            href="/employer/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_20px_40px_-12px_rgba(194,165,109,0.5)]"
          >
            ثبت آگهی رایگان
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* main columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-14 md:grid-cols-2 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-display text-2xl font-bold text-paper">
            جابینو
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />
          </Link>
          <p className="max-w-sm text-sm leading-7 text-paper/50">
            پلتفرم آگهی‌های استخدام؛ جایی برای پیدا کردن فرصت شغلی بعدی‌ت
            و استعدادهای نیاز تیم‌ت.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {["ثبت‌نام رایگان", "بدون واسطه", "آگهی به‌روز"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-paper/60"
              >
                <Check className="h-3.5 w-3.5 text-gold/70" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <FooterColumn title="دسترسی سریع" links={quickLinks} />
        <FooterColumn title="برای کارجویان" links={candidateLinks} />
        <FooterColumn title="برای کارفرمایان" links={employerLinks} />
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-paper/40 sm:flex-row md:px-10">
          <p>© {new Date().getFullYear()} جابینو. تمامی حقوق محفوظ است.</p>
          <p className="inline-flex items-center gap-1.5">
            ساخته‌شده با
            <Heart className="h-3.5 w-3.5 text-gold/70" fill="currentColor" />
            برای بازار کار ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
