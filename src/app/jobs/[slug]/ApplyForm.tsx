"use client";

import { useActionState } from "react";
import { applyToJob } from "@/lib/actions/applyToJob";

export default function ApplyForm({ jobId }: { jobId: string }) {
  const applyWithJobId = applyToJob.bind(null, jobId);
  const [state, formAction, isPending] = useActionState(applyWithJobId, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h3 className="font-display text-lg font-semibold text-ink">
        اپلای برای این شغل
      </h3>
      <textarea
        name="coverLetter"
        placeholder="متن انگیزه‌نامه (اختیاری)"
        rows={4}
        className="input-field rounded-md border p-3 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-fit rounded-md px-5 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
      {state.message && (
        <p className={`text-sm ${state.success ? "text-success" : "text-danger"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
