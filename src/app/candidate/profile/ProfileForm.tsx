"use client";

import { useActionState, useRef, useState } from "react";
import {
  updateCandidateProfile,
  type UpdateProfileState,
} from "@/lib/actions/updateProfile";
import { Check, Circle, Upload } from "lucide-react";

const initialState: UpdateProfileState = {};

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`
    : `${Math.ceil(bytes / 1024)} کیلوبایت`;
}

type Props = {
  name: string;
  email: string;
  phone: string;
  resumePdf: string;
  bio: string;
};

const R = 54;
const C = 2 * Math.PI * R;

function CompletionRing({ pct }: { pct: number }) {
  const filled = Math.round((pct * 3) / 100);
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r={R} className="fill-white stroke-ink/6" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={R}
          className="stroke-gold"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black leading-none text-ink">
          {pct}
          <span className="text-base font-bold text-ink-muted">٪</span>
        </span>
        <span className="mt-1 text-[11px] font-semibold text-ink-muted">{filled} از ۳</span>
      </div>
    </div>
  );
}

export default function ProfileForm({ name, email, phone, resumePdf, bio }: Props) {
  const isFirstTime = !phone && !resumePdf && !bio;
  const [isEditing, setIsEditing] = useState(isFirstTime);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    updateCandidateProfile,
    initialState
  );
  const errors = state.fieldErrors ?? {};

  // اعتبارسنجی سریع سمت کلاینت تا کاربر منتظر ارسال فرم نماند.
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
    if (resumeInputRef.current) resumeInputRef.current.value = "";
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

  // بعد از ثبت موفق، از حالت ویرایش خارج شو. این کار حین رندر انجام می‌شه
  // (الگوی توصیه‌شده‌ی React برای «adjusting state when a value changes»)،
  // نه داخل useEffect، چون همون‌جا setState زدن باعث یک رندر اضافه می‌شه.
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.success) {
      setIsEditing(false);
    }
  }

  // بعد از ذخیره‌ی موفق، مقادیر تازه رو از خروجی اکشن نشون بده (بدون نیاز
  // به رفرش کامل صفحه)؛ قبل از اولین submit، همون مقادیر اولیه از سرور.
  const effective = {
    phone: state.values?.phone ?? phone,
    resumePdf: state.values?.resumePdf ?? resumePdf,
    bio: state.values?.bio ?? bio,
  };

  const resumeFileName = effective.resumePdf
    ? effective.resumePdf.split("/").pop() ?? effective.resumePdf
    : "";

  type ProfileRow = {
    label: string;
    value: string;
    dir?: "ltr";
    display?: string;
    isLink?: boolean;
  };

  const profileRows: ProfileRow[] = [
    { label: "شماره تماس", value: effective.phone, dir: "ltr" },
    {
      label: "رزومه",
      value: effective.resumePdf,
      display: resumeFileName,
      isLink: Boolean(effective.resumePdf),
    },
    { label: "معرفی", value: effective.bio },
  ];

  const initial = name?.trim()?.[0] ?? "؟";
  const fields = [
    { label: "شماره تماس", filled: Boolean(effective.phone) },
    { label: "رزومه", filled: Boolean(effective.resumePdf) },
    { label: "معرفی", filled: Boolean(effective.bio) },
  ];
  const filledCount = fields.filter((f) => f.filled).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="mt-6 overflow-hidden rounded-4xl border border-line bg-white/70 shadow-[0_40px_100px_-40px_rgba(44,57,71,0.28)] backdrop-blur">
      {/* بنر */}
      <div className="relative h-44 overflow-hidden bg-linear-to-br from-gold/25 via-gold/8 to-slate/5 md:h-52">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-gold/18 blur-3xl" />
          <div className="absolute -left-16 -bottom-20 h-48 w-48 rounded-full bg-slate/12 blur-3xl" />
        </div>
      </div>

      <div className="relative px-6 md:px-8">
        {/* آواتار */}
        <div className="flex justify-center">
          <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white bg-white text-4xl font-black text-slate-dark shadow-[0_24px_60px_-12px_rgba(44,57,71,0.35)] ring-[5px] ring-white/80">
            {initial}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-sm text-center">
          <h1 className="font-display text-2xl font-black text-ink md:text-3xl">{name}</h1>
          <p className="mt-1 text-sm text-ink-muted">{email}</p>
        </div>

        {isEditing ? (
          <div className="mx-auto mt-8 max-w-lg pb-8">
            {isFirstTime && (
              <p className="mb-5 rounded-md bg-gold/10 px-3 py-2 text-sm text-ink">
                این اولین باری است که وارد پروفایل خود شده‌اید — اطلاعات خود را کامل کنید تا کارفرماها بهتر با شما آشنا شوند.
              </p>
            )}
            {state.error && <p className="mb-4 text-sm text-danger">{state.error}</p>}

            <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="profile-phone" className="mb-1.5 block text-sm text-ink-muted">شماره تماس</label>
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  defaultValue={effective.phone}
                  placeholder="مثلاً 09123456789"
                  dir="ltr"
                  className="input-field w-full rounded-md border p-3 text-sm"
                />
                {errors.phone && <p className="mt-1.5 text-sm text-danger">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="profile-resume" className="mb-1.5 block text-sm text-ink-muted">رزومه (PDF)</label>
                {effective.resumePdf && (
                  <div className="mb-2 flex items-center justify-between gap-3 rounded-md border border-line bg-paper/60 px-3 py-2.5">
                    <a
                      href={effective.resumePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-slate underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {resumeFileName}
                    </a>
                    <label
                      htmlFor="remove-resume"
                      className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-ink-muted transition hover:text-danger"
                    >
                      <input
                        id="remove-resume"
                        name="removeResume"
                        type="checkbox"
                        value="1"
                        className="accent-slate"
                      />
                      حذف رزومه
                    </label>
                  </div>
                )}
                <label
                  htmlFor="profile-resume"
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white/60 px-4 py-6 text-center transition hover:border-gold/50 hover:bg-gold/5 ${
                    selectedResume ? "border-emerald-300 bg-emerald-50/40" : "border-slate/25"
                  }`}
                >
                  {selectedResume ? (
                    <>
                      <Check
                        className="h-8 w-8 text-emerald-600"
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
                        className="h-8 w-8 text-slate"
                      />
                      <span className="text-sm font-semibold text-ink">انتخاب فایل رزومه</span>
                      <span className="text-xs text-ink-muted">فقط PDF، حداکثر ۵ مگابایت</span>
                    </>
                  )}
                </label>
                <input
                  ref={resumeInputRef}
                  id="profile-resume"
                  name="resumePdf"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                {fileError && <p className="mt-1.5 text-sm text-danger">{fileError}</p>}
                {selectedResume && !state.success && (
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    className="mt-2 text-xs text-ink-muted transition hover:text-danger"
                  >
                    حذف فایل انتخاب‌شده
                  </button>
                )}
                {errors.resumePdf && (
                  <p className="mt-1.5 text-sm text-danger">{errors.resumePdf}</p>
                )}
              </div>

              <div>
                <label htmlFor="profile-bio" className="mb-1.5 block text-sm text-ink-muted">معرفی کوتاه</label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  defaultValue={effective.bio}
                  rows={5}
                  maxLength={600}
                  placeholder="چند جمله درباره‌ی سابقه، مهارت‌ها و علاقه‌مندی‌های شغلی‌ات بنویس..."
                  className="input-field w-full rounded-md border p-3 text-sm"
                />
                {errors.bio && <p className="mt-1.5 text-sm text-danger">{errors.bio}</p>}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary w-fit rounded-md px-6 py-2.5 text-sm disabled:opacity-50"
                >
                  {isPending ? "در حال ذخیره..." : "ذخیره‌ی تغییرات"}
                </button>

                {!isFirstTime && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-sm text-ink-muted transition hover:text-ink"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <>
            {state.success && (
              <p className="mx-auto mt-6 max-w-lg rounded-md bg-success/10 px-3 py-2 text-center text-sm text-success">
                پروفایل با موفقیت به‌روزرسانی شد.
              </p>
            )}

            <div className="mx-auto mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <CompletionRing pct={completionPct} />
              <div className="flex flex-1 flex-col gap-2.5 pt-2">
                {fields.map((f) => (
                  <span
                    key={f.label}
                    className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${
                      f.filled
                        ? "border-emerald-200/60 bg-emerald-50/80 text-emerald-800"
                        : "border-ink/8 bg-ink/2 text-ink-muted"
                    }`}
                  >
                    {f.filled ? (
                      <Check
                        className={`h-5 w-5 shrink-0 ${f.filled ? "text-emerald-500" : "text-ink-muted/30"}`}
                      />
                    ) : (
                      <Circle
                        className={`h-5 w-5 shrink-0 ${f.filled ? "text-emerald-500" : "text-ink-muted/30"}`}
                      />
                    )}
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-lg">
              <div className="grid grid-cols-1 gap-2.5">
                {profileRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3.5 rounded-2xl border border-line/60 bg-paper/60 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        {row.label}
                      </p>
                      {row.value ? (
                        row.isLink ? (
                          <a
                            href={row.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 block truncate text-sm font-medium text-slate underline-offset-4 hover:underline"
                          >
                            {row.display ?? row.value}
                          </a>
                        ) : (
                          <p
                            dir={row.dir}
                            className="mt-0.5 whitespace-pre-line text-sm leading-6 text-ink"
                          >
                            {row.value}
                          </p>
                        )
                      ) : (
                        <p className="mt-0.5 text-sm text-ink-muted/60">—</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-line/60 px-0 py-5">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="group inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-paper shadow-lg transition hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0"
              >
                ویرایش اطلاعات
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}