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
      <h3 className="text-lg font-semibold text-gray-900">
        اپلای برای این شغل
      </h3>
      <textarea
        name="coverLetter"
        placeholder="متن انگیزه‌نامه (اختیاری)"
        rows={4}
        className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
