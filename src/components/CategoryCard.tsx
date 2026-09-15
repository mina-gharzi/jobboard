import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Sparkles } from "lucide-react";

export type CategoryCardProps = {
  category: string;
  count?: number;
  featured?: boolean;
  index?: number;
};

export default function CategoryCard({
  category,
  count,
  featured = false,
  index = 0,
}: CategoryCardProps) {
  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      style={{ animationDelay: `${index * 80}ms` }}
      className={[
        "group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl",
        "border border-white/70 bg-white/60 p-4 shadow-sm",
        "backdrop-blur-xl outline-none transition-all duration-400",
        "animate-fade-in-up hover:-translate-y-1 hover:border-gold/50",
        "hover:bg-white/85 hover:shadow-[0_16px_40px_-16px_rgba(84,122,149,0.3)]",
        featured
          ? "border-gold/30 bg-gradient-to-br from-white via-white/80 to-gold/10"
          : "",
      ].join(" ")}
    >
      {/* Glow */}
      <span className="pointer-events-none absolute -left-10 -top-10 -z-10 h-28 w-28 rounded-full bg-gold/12 blur-2xl transition-transform duration-700 group-hover:scale-150" />

      {/* فلش بالا سمت چپ */}
      <div className="flex items-center justify-end">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 bg-paper/70 text-ink-muted transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold group-hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </span>
      </div>

      {/* محتوا */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-gold">
          {featured ? (
            <Sparkles className="h-3 w-3" />
          ) : (
            <BriefcaseBusiness className="h-3 w-3" />
          )}
          <span>{featured ? "منتخب" : "فرصت شغلی"}</span>
        </div>

        <h3
          className={
            featured
              ? "text-base font-black text-ink md:text-lg"
              : "text-sm font-bold text-ink"
          }
        >
          {category}
        </h3>

        {typeof count === "number" && (
          <span className="mt-2.5 inline-flex items-center rounded-full border border-slate/12 bg-paper/60 px-2.5 py-1 text-[11px] font-semibold text-slate tabular-nums">
            {count.toLocaleString("fa-IR")} آگهی
          </span>
        )}
      </div>
    </Link>
  );
}
