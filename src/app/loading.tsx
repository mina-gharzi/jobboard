import { LogoMark } from "@/components/icons";

export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4">
      <span className="animate-pulse-glow flex h-16 w-16 items-center justify-center rounded-3xl bg-ink shadow-[0_16px_40px_-12px_rgba(44,57,71,0.5)]">
        <LogoMark className="h-8 w-8 text-gold" />
      </span>

      <div className="text-center">
        <p className="font-display text-2xl font-bold text-ink">جابینو</p>
        <p className="mt-2 text-sm text-ink-muted">در حال بارگذاری...</p>
      </div>
    </div>
  );
}