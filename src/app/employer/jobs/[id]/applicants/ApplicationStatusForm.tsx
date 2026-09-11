"use client";

import { useActionState } from "react";
import {
  updateApplicationStatus,
  type UpdateStatusState,
} from "@/lib/actions/updateApplicationStatus";
import { applicationStatusOptions } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma";

const initialState: UpdateStatusState = {};

export default function ApplicationStatusForm({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateApplicationStatus,
    initialState
  );

  return (
    <form
      action={formAction}
      aria-label="تغییر وضعیت درخواست"
      className="mt-4 flex flex-col gap-2 border-t border-line pt-4"
    >
      <div className="flex items-center gap-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <label
          htmlFor={`applicant-status-${applicationId}`}
          className="sr-only"
        >
          وضعیت درخواست
        </label>
        <select
          id={`applicant-status-${applicationId}`}
          name="status"
          defaultValue={status}
          className="w-full rounded-xl border border-ink/10 bg-white/70 px-3 py-2.5 text-sm text-ink shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        >
          {applicationStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover active:translate-y-0 disabled:opacity-50"
        >
          {isPending ? "در حال ثبت..." : "ثبت تغییر وضعیت"}
        </button>
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">وضعیت به‌روزرسانی شد ✓</p>
      )}
    </form>
  );
}