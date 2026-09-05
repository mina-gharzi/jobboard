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
    <form action={formAction}>
      <h3>اپلای برای این شغل</h3>
      <textarea name="coverLetter" placeholder="متن انگیزه‌نامه (اختیاری)" rows={4} />
      <button type="submit" disabled={isPending}>
        {isPending ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
      {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>{state.message}</p>
      )}
    </form>
  );
}