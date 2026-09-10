"use client";

import { useActionState, useRef, useState } from "react";
import { applyToJob } from "@/lib/actions/applyToJob";
import { Check, Upload } from "lucide-react";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`
    : `${Math.ceil(bytes / 1024)} کیلوبایت`;
}

export default function ApplyForm({
  jobId,
  idPrefix = "",
}: {
  jobId: string;
  idPrefix?: string;
}) {
  const applyWithJobId = applyToJob.bind(null, jobId);
  const makeId = (suffix: string) => `${idPrefix}apply-${suffix}`;
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
        <label htmlFor={makeId("cover-letter")} className="mb-1.5 block text-sm font-semibold text-ink-muted">
          متن انگیزه‌نامه (اختیاری)
        </label>
        <textarea
          id={makeId("cover-letter")}
          name="coverLetter"
          placeholder="چرا برای این موقعیت مناسب هستید؟"
          rows={4}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
      </div>

      <label
        htmlFor={makeId("resume")}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white/60 px-4 py-5 text-center transition hover:border-gold/50 hover:bg-gold/5 ${
          selectedResume ? "border-emerald-300 bg-emerald-50/40" : "border-slate/25"
        }`}
      >
        {selectedResume ? (
          <>
            <Check
              className="h-7 w-7 text-emerald-600"
            />
            <span className="text-sm font-semibold text-ink" dir="ltr">
              {selectedResume.name}
            </span>
            <span className="text-xs text-ink-muted">
              {formatSize(selectedResume.size)} • برای تغییر کلیک کنید
            </span>
          </>
        ) : (
          <>
            <Upload
              className="h-7 w-7 text-slate"
            />
            <span className="text-sm font-semibold text-ink">پیوست رزومه (اختیاری)</span>
            <span className="text-xs text-ink-muted">فقط PDF، حداکثر ۵ مگابایت</span>
          </>
        )}
      </label>
      <input
        ref={inputRef}
        id={makeId("resume")}
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isPending ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
      {state.success ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-700">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0"
          />
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