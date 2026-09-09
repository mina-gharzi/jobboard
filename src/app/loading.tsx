export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4">
      <span className="animate-pulse-glow flex h-16 w-16 items-center justify-center rounded-3xl bg-ink shadow-[0_16px_40px_-12px_rgba(44,57,71,0.5)]">
        <svg
          className="h-8 w-8 text-gold"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 9h2M9 13h2M9 17h2" />
          <path d="M14 9h2M14 13h2M14 17h2" />
        </svg>
      </span>

      <div className="text-center">
        <p className="font-display text-2xl font-bold text-ink">جابینو</p>
        <p className="mt-2 text-sm text-ink-muted">در حال بارگذاری...</p>
      </div>
    </div>
  );
}