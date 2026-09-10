"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toggleSavedJob } from "@/lib/actions/toggleSavedJob";

export default function SaveJobButton({
  jobId,
  initialSaved,
  signedIn,
  className = "",
}: {
  jobId: string;
  initialSaved: boolean;
  signedIn?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!signedIn) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const res = await toggleSavedJob(jobId);
      if (res?.success) setSaved(res.saved);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره آگهی"}
      title={saved ? "حذف از ذخیره‌ها" : "ذخیره آگهی"}
      className={`inline-flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25 disabled:opacity-50 md:text-sm ${
        saved
          ? "border-gold/40 bg-gold/10 text-gold hover:bg-gold/15"
          : "border-ink/10 bg-white/70 text-ink-muted shadow-sm backdrop-blur hover:border-gold/40 hover:text-gold"
      } ${className}`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-gold" : ""}`} />
      <span className="hidden sm:inline">
        {saved ? "ذخیره شده" : "ذخیره"}
      </span>
    </button>
  );
}