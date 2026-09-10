"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Undo2, X } from "lucide-react";
import { withdrawApplication } from "@/lib/actions/withdrawApplication";

export default function WithdrawApplicationButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await withdrawApplication(applicationId);
      if (res.success) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(res.message);
        setConfirming(false);
      }
    });
  }

  return (
    <>
      {error && !confirming && (
        <button
          type="button"
          onClick={() => setError(null)}
          className="ms-auto inline-flex items-center gap-1.5 rounded-xl border border-amber-300/50 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100/80"
        >
          {error}
          <X className="h-3 w-3" />
        </button>
      )}

      {!error && !confirming && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-ink-muted backdrop-blur transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 disabled:opacity-50"
        >
          <Undo2 className="h-3.5 w-3.5" />
          انصراف از درخواست
        </button>
      )}

      {confirming && (
        <span className="inline-flex items-center gap-2">
          <span className="text-xs font-semibold text-ink">مطمئنید؟</span>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30 disabled:opacity-50"
          >
            {isPending ? "در حال انصراف..." : "بله، پس بگیر"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            aria-label="انصراف از حذف"
            className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink-muted backdrop-blur transition hover:border-ink/25 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/20 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      )}
    </>
  );
}