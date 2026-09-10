"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { deleteJob, type DeleteJobState } from "@/lib/actions/manageJob";
import { Trash2 } from "lucide-react";

const initialState: DeleteJobState = {};

export default function DeleteJobForm({ jobId }: { jobId: string }) {
  const deleteJobWithId = deleteJob.bind(null, jobId);
  const [state, formAction, isPending] = useActionState(deleteJobWithId, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    cancelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) triggerRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <>
      <form action={formAction} className="mt-4">
        {state.error && <p className="mb-2 text-sm text-danger">{state.error}</p>}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-md border border-danger py-3 text-sm text-danger transition hover:bg-danger/5"
        >
          حذف این آگهی
        </button>
      </form>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-job-title"
          aria-describedby="delete-job-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            aria-label="بستن"
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />

          <div
            ref={panelRef}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-paper shadow-[0_48px_100px_-24px_rgba(44,57,71,0.6)]"
          >
            <div className="p-6 text-center md:p-8">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
                <Trash2 className="h-8 w-8 text-danger" strokeWidth={1.8} />
              </span>

              <h2 id="delete-job-title" className="mt-5 text-lg font-black text-ink md:text-xl">
                حذف آگهی
              </h2>
              <p id="delete-job-desc" className="mt-3 text-sm leading-7 text-ink-muted">
                این آگهی و همه‌ی درخواست‌های ثبت‌شده برای آن برای همیشه حذف
                خواهند شد و امکان بازگردانی وجود ندارد. آیا از انجام این کار
                مطمئن هستید؟
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2.5 border-t border-line bg-ink/2 p-4 sm:flex-row sm:justify-end md:p-5">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-ink/10 bg-white/70 px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_24px_-12px_rgba(44,57,71,0.25)] sm:flex-none"
              >
                انصراف
              </button>

              <button
                type="submit"
                formAction={formAction}
                disabled={isPending}
                className="flex-1 rounded-xl bg-danger px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-danger-dark disabled:opacity-50 sm:flex-none"
              >
                {isPending ? "در حال حذف..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}