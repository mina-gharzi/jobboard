"use client";

import Link from "next/link";

export default function RouteError({
  reset,
  title = "مشکلی پیش آمد",
  description = "در هنگام بارگذاری این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.",
}: {
  reset?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] border border-line bg-white/70 p-8 text-center shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
          <svg
            className="h-8 w-8 text-danger"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
        </span>

        <h1 className="mt-5 text-xl font-black text-ink">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-muted">{description}</p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0 sm:flex-none"
            >
              تلاش مجدد
            </button>
          )}
          <Link
            href="/"
            className="flex-1 rounded-xl border border-ink/10 bg-white/70 px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_12px_24px_-12px_rgba(194,165,109,0.4)] sm:flex-none"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}