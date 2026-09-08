"use client";

import { useActionState } from "react";
import {
  updateApplicationStatus,
  type UpdateStatusState,
} from "@/lib/actions/updateApplicationStatus";
import { applicationStatusOptions } from "@/lib/status";
import type { ApplicationStatus } from "@/generated/prisma/enums";

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
      className="mt-4 flex flex-col gap-2 border-t border-line pt-4"
    >
      <div className="flex items-center gap-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <select
          name="status"
          defaultValue={status}
          className="input-field rounded-md border p-2 text-sm"
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
          className="btn-primary rounded-md px-4 py-2 text-sm disabled:opacity-50"
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