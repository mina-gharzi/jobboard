"use client";

import { useActionState } from "react";
import { deleteJob, type DeleteJobState } from "@/lib/actions/manageJob";

const initialState: DeleteJobState = {};

export default function DeleteJobForm({ jobId }: { jobId: string }) {
  const deleteJobWithId = deleteJob.bind(null, jobId);
  const [state, formAction, isPending] = useActionState(deleteJobWithId, initialState);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      "این آگهی و همه‌ی درخواست‌های ثبت‌شده برای آن برای همیشه حذف خواهند شد. آیا مطمئن هستید؟"
    );
    if (!confirmed) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="mt-4">
      {state.error && <p className="mb-2 text-sm text-danger">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md border border-danger py-3 text-sm text-danger hover:bg-danger/5 disabled:opacity-50"
      >
        {isPending ? "در حال حذف..." : "حذف این آگهی"}
      </button>
    </form>
  );
}
