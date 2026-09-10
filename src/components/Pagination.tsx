import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

const formatNumberDefault = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

const btnCls =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25";

const disabledCls =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/5 text-ink-muted/30";

type Props = {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  pageItems?: (number | "...")[];
  formatNumber?: (n: number) => string;
};

export default function Pagination({
  page,
  totalPages,
  href,
  pageItems,
  formatNumber = formatNumberDefault,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-14"
    >
      {/* صفحهی قبل — فلش راست در RTL */}
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="صفحهی قبل" className={btnCls}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledCls} />
      )}

      {pageItems
        ? pageItems.map((item, i) =>
            item === "..." ? (
              <span key={`gap-${i}`} className="px-1 text-sm text-ink-muted">
                …
              </span>
            ) : (
              <Link
                key={item}
                href={href(item)}
                aria-current={item === page ? "page" : undefined}
                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25 ${
                  item === page
                    ? "bg-ink text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)]"
                    : "border border-ink/10 bg-white/60 text-ink hover:border-gold hover:text-gold hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)]"
                }`}
              >
                {formatNumber(item)}
              </Link>
            )
          )
        : (
            <span className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-ink px-4 text-sm font-bold text-paper shadow-[0_16px_32px_-16px_rgba(44,57,71,0.5)]">
              صفحه‌ی {formatNumber(page)} از {formatNumber(totalPages)}
            </span>
          )}

      {/* صفحهی بعد — فلش چپ در RTL */}
      {page < totalPages ? (
        <Link href={href(page + 1)} aria-label="صفحهی بعد" className={btnCls}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledCls} />
      )}
    </nav>
  );
}