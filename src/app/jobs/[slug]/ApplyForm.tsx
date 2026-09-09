"use client";

import { useActionState, useRef, useState } from "react";
import { applyToJob } from "@/lib/actions/applyToJob";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`
    : `${Math.ceil(bytes / 1024)} کیلوبایت`;
}

export default function ApplyForm({ jobId }: { jobId: string }) {
  const applyWithJobId = applyToJob.bind(null, jobId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(applyWithJobId, {
    success: false,
    message: "",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setSelectedResume(null);
      setFileError(null);
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setSelectedResume(null);
      e.target.value = "";
      setFileError("حجم فایل نمی‌تواند بیشتر از ۵ مگابایت باشد");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedResume(null);
      e.target.value = "";
      setFileError("فقط فایل PDF مجاز است");
      return;
    }

    setSelectedResume(file);
    setFileError(null);
  }

  function clearSelectedFile() {
    setSelectedResume(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  // ساخت دستی FormData: در برخی نسخه‌های React/Next هنگام ارسال خودکار فرمِ
  // حاوی فایل، ورودی‌های FormData (از جمله فایل) حذف می‌شوند (issue #93822).
  // فایل را از state تزریق می‌کنیم تا مطمئن باشیم به سرور می‌رسد.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (selectedResume) {
      fd.set("resumePdf", selectedResume);
    } else {
      fd.delete("resumePdf");
    }
    formAction(fd);
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="font-display text-lg font-semibold text-ink">
        اپلای برای این شغل
      </h3>

      <div>
        <label htmlFor="apply-cover-letter" className="mb-1.5 block text-sm text-ink-muted">
          متن انگیزه‌نامه (اختیاری)
        </label>
        <textarea
          id="apply-cover-letter"
          name="coverLetter"
          placeholder="چرا برای این موقعیت مناسب هستید؟"
          rows={4}
          className="input-field w-full rounded-md border p-3 text-sm"
        />
      </div>

      <label
        htmlFor="apply-resume"
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white/60 px-4 py-5 text-center transition hover:border-gold/50 hover:bg-gold/5 ${
          selectedResume ? "border-emerald-300 bg-emerald-50/40" : "border-slate/25"
        }`}
      >
        {selectedResume ? (
          <>
            <svg
              className="h-7 w-7 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 5 5L20 7" />
            </svg>
            <span className="text-sm font-semibold text-ink" dir="ltr">
              {selectedResume.name}
            </span>
            <span className="text-xs text-ink-muted">
              {formatSize(selectedResume.size)} • برای تغییر کلیک کنید
            </span>
          </>
        ) : (
          <>
            <svg
              className="h-7 w-7 text-slate"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M17 8l-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
            <span className="text-sm font-semibold text-ink">پیوست رزومه (اختیاری)</span>
            <span className="text-xs text-ink-muted">فقط PDF، حداکثر ۵ مگابایت</span>
          </>
        )}
      </label>
      <input
        ref={inputRef}
        id="apply-resume"
        name="resumePdf"
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleFileChange}
      />

      {fileError && <p className="text-sm text-danger">{fileError}</p>}
      {selectedResume && !state.success && (
        <button
          type="button"
          onClick={clearSelectedFile}
          className="self-start text-xs text-ink-muted transition hover:text-danger"
        >
          حذف فایل انتخاب‌شده
        </button>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-fit rounded-md px-5 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
      {state.success ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-700">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
          <span>
            {state.attachment
              ? "درخواست شما همراه با رزومه با موفقیت ثبت شد."
              : "درخواست شما با موفقیت ثبت شد."}
          </span>
        </div>
      ) : (
        state.message && <p className="text-sm text-danger">{state.message}</p>
      )}
    </form>
  );
}