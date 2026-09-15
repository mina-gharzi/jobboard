import Link from "next/link";
import { ArrowLeft, Search, Layers3 } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";

type CategoryEntry = {
  category: string;
  count: number;
};

type Props = {
  categories: CategoryEntry[];
};

export default function CategoriesGrid({ categories }: Props) {
  const topCategories = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <section dir="rtl" className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute -right-32 top-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-5 h-56 w-56 rounded-full bg-slate/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate">
            <span className="h-px w-8 bg-gold/60" />
            دسته‌بندی‌های محبوب
            <span className="h-px w-8 bg-gold/60" />
          </span>

          <h2 className="mt-4 text-xl font-black tracking-tight text-ink md:text-3xl">
            مسیر شغلی مناسب خودت را پیدا کن
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-muted">
            محبوب‌ترین دسته‌بندی‌های شغلی را بررسی کن و فرصت بعدی خودت را پیدا
            کن
          </p>
        </header>

        {topCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {topCategories.map(({ category, count }, index) => (
              <CategoryCard
                key={category}
                category={category}
                count={count}
                index={index}
                featured={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-12 text-center text-ink-muted backdrop-blur-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15">
              <Search className="h-6 w-6 text-gold" strokeWidth={1.8} />
            </div>
            <span className="text-sm">هنوز دسته‌بندی‌ای موجود نیست.</span>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-2 rounded-xl bg-slate px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-dark hover:shadow-xl hover:shadow-slate/30"
          >
            مشاهده همه دسته‌بندی‌ها
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
