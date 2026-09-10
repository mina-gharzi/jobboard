"use client";

import { useActionState, useRef, useState } from "react";
import AvatarImage from "@/components/AvatarImage";
import { COMPANY_TEAM_SIZES } from "@/lib/companyTeamSizes";
import {
  updateCompanyProfile,
  type UpdateCompanyProfileState,
} from "@/lib/actions/updateCompanyProfile";
import { Check, Circle, Upload, X } from "lucide-react";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`
    : `${Math.ceil(bytes / 1024)} کیلوبایت`;
}

const initialState: UpdateCompanyProfileState = {};

type Props = {
  email: string;
  name: string;
  logoUrl: string;
  companyDescription: string;
  companyWebsite: string;
  companyTeamSize: string;
};

const R = 54;
const C = 2 * Math.PI * R;

function CompletionRing({ pct, filled, total }: { pct: number; filled: number; total: number }) {
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
        <span className="mt-1 text-[11px] font-semibold text-ink-muted">
          {filled} از {total}
        </span>
      </div>
    </div>
  );
}

export default function CompanyProfileForm({
  email,
  name,
  logoUrl,
  companyDescription,
  companyWebsite,
  companyTeamSize,
}: Props) {
  const isFirstTime = !logoUrl && !companyDescription && !companyWebsite && !companyTeamSize;
  const [isEditing, setIsEditing] = useState(isFirstTime);
  const [state, formAction, isPending] = useActionState(
    updateCompanyProfile,
    initialState
  );
  const errors = state.fieldErrors ?? {};
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setRemoveLogo(false);

    if (!file) {
      setSelectedLogo(null);
      setLogoError(null);
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setSelectedLogo(null);
      e.target.value = "";
      setLogoError("حجم فایل لوگو نمی‌تواند بیشتر از ۲ مگابایت باشد");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setSelectedLogo(null);
      e.target.value = "";
      setLogoError("فقط فایل‌های JPEG، PNG و WebP مجاز هستند");
      return;
    }

    setSelectedLogo(file);
    setLogoError(null);
  }

  // ساخت دستی FormData: ورودی فایل را از state تزریق می‌کنیم تا مطمئن باشیم
  // به سرور می‌رسد (همان الگوی رزومه در ApplyForm/ProfileForm).
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (selectedLogo) {
      fd.set("logoFile", selectedLogo);
    } else {
      fd.delete("logoFile");
    }
    fd.set("removeLogo", removeLogo ? "1" : "0");
    formAction(fd);
  }

  // بعد از ثبت موفق، از حالت ویرایش خارج شو — حین رندر (نه داخل
  // useEffect) تا رندر اضافه ایجاد نشه.
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.success) {
      setIsEditing(false);
    }
  }

  const effective = {
    name: state.values?.name ?? name,
    logoUrl: state.values?.logoUrl ?? logoUrl,
    companyDescription: state.values?.companyDescription ?? companyDescription,
    companyWebsite: state.values?.companyWebsite ?? companyWebsite,
    companyTeamSize: state.values?.companyTeamSize ?? companyTeamSize,
  };

  const initial = effective.name?.trim()?.[0] ?? "؟";
  const fields = [
    { label: "لوگو", filled: Boolean(effective.logoUrl) },
    { label: "وبسایت", filled: Boolean(effective.companyWebsite) },
    { label: "تیم", filled: Boolean(effective.companyTeamSize) },
    { label: "درباره شرکت", filled: Boolean(effective.companyDescription) },
  ];
  const filledCount = fields.filter((f) => f.filled).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="mt-6 overflow-hidden rounded-4xl border border-line bg-white/70 shadow-[0_40px_100px_-40px_rgba(44,57,71,0.28)] backdrop-blur">
      {/* بنر */}
      <div className="relative h-44 overflow-hidden bg-linear-to-br from-slate/18 via-gold/8 to-gold/12 md:h-52">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-gold/18 blur-3xl" />
          <div className="absolute -left-16 -bottom-20 h-48 w-48 rounded-full bg-slate/12 blur-3xl" />
        </div>
      </div>

      <div className="relative px-6 md:px-8">
        {/* لوگو */}
        <div className="flex justify-center">
          <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white bg-white text-4xl font-black text-slate-dark shadow-[0_24px_60px_-12px_rgba(44,57,71,0.35)] ring-[5px] ring-white/80">
            <AvatarImage
              src={effective.logoUrl}
              fallback={initial}
              imageClassName="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-sm text-center">
          <div className="inline-flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink md:text-3xl">
              {effective.name}
            </h1>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[11px] font-bold text-ink">
              کارفرما
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{email}</p>
        </div>

        {isEditing ? (
          <div className="mx-auto mt-8 max-w-lg pb-8">
            {isFirstTime && (
              <p className="mb-5 rounded-md bg-gold/10 px-3 py-2 text-sm text-ink">
                این اولین باری است که وارد پروفایل شرکت شده‌اید — اطلاعات خود را کامل کنید تا کارجوها بهتر با شما آشنا شوند.
              </p>
            )}
            {state.error && <p className="mb-4 text-sm text-danger">{state.error}</p>}

            <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="company-name" className="mb-1.5 block text-sm font-semibold text-ink-muted">نام شرکت</label>
                <input
                  id="company-name"
                  name="name"
                  type="text"
                  defaultValue={effective.name}
                  required
                  className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
                />
                {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="company-logo" className="mb-1.5 block text-sm font-semibold text-ink-muted">لوگوی شرکت</label>
                {effective.logoUrl && !selectedLogo && !removeLogo ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/60 px-4 py-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                      <AvatarImage
                        src={effective.logoUrl}
                        fallback={effective.name?.trim()?.[0] ?? "؟"}
                        imageClassName="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink" dir="ltr">
                        {effective.logoUrl}
                      </p>
                      <p className="text-[11px] text-ink-muted">برای تغییر، فایل جدید انتخاب کنید</p>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="company-logo-file"
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white/60 px-4 py-6 text-center transition hover:border-gold/50 hover:bg-gold/5 ${
                      selectedLogo ? "border-emerald-300 bg-emerald-50/40" : "border-slate/25"
                    }`}
                  >
                    {selectedLogo ? (
                      <>
                        <Check className="h-7 w-7 text-emerald-600" />
                        <span className="text-sm font-semibold text-ink" dir="ltr">
                          {selectedLogo.name}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {formatSize(selectedLogo.size)} • برای تغییر کلیک کنید
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-7 w-7 text-slate" />
                        <span className="text-sm font-semibold text-ink">بارگذاری لوگو</span>
                        <span className="text-xs text-ink-muted">
                          JPEG، PNG یا WebP — حداکثر ۲ مگابایت
                        </span>
                      </>
                    )}
                  </label>
                )}
                <input
                  ref={logoInputRef}
                  id="company-logo-file"
                  name="logoFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
                {logoError && <p className="mt-1.5 text-sm text-danger">{logoError}</p>}
                {effective.logoUrl && !removeLogo && !selectedLogo && (
                  <button
                    type="button"
                    onClick={() => setRemoveLogo(true)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-ink-muted transition hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" />
                    حذف لوگوی فعلی
                  </button>
                )}
                {(selectedLogo || removeLogo) && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
                    <X className="h-3.5 w-3.5" />
                    {removeLogo ? "لوگوی فعلی حذف خواهد شد" : "لوگوی جدید جایگزین خواهد شد"}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="company-website" className="mb-1.5 block text-sm font-semibold text-ink-muted">وب‌سایت شرکت</label>
                <input
                  id="company-website"
                  name="companyWebsite"
                  type="url"
                  defaultValue={effective.companyWebsite}
                  placeholder="https://example.com"
                  dir="ltr"
                  className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
                />
                {errors.companyWebsite && (
                  <p className="mt-1.5 text-sm text-danger">{errors.companyWebsite}</p>
                )}
              </div>

              <div>
                <label htmlFor="company-team" className="mb-1.5 block text-sm font-semibold text-ink-muted">اندازه‌ی تیم</label>
                <select
                  id="company-team"
                  name="companyTeamSize"
                  defaultValue={effective.companyTeamSize}
                  className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
                >
                  <option value="">مشخص نشده</option>
                  {COMPANY_TEAM_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.companyTeamSize && (
                  <p className="mt-1.5 text-sm text-danger">{errors.companyTeamSize}</p>
                )}
              </div>

              <div>
                <label htmlFor="company-desc" className="mb-1.5 block text-sm font-semibold text-ink-muted">درباره‌ی شرکت</label>
                <textarea
                  id="company-desc"
                  name="companyDescription"
                  defaultValue={effective.companyDescription}
                  rows={5}
                  maxLength={800}
                  placeholder="چند جمله درباره‌ی شرکت، حوزه‌ی فعالیت و فرهنگ کاریتون بنویسید..."
                  className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
                />
                {errors.companyDescription && (
                  <p className="mt-1.5 text-sm text-danger">{errors.companyDescription}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
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
                پروفایل شرکت با موفقیت به‌روزرسانی شد.
              </p>
            )}

            <div className="mx-auto mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <CompletionRing pct={completionPct} filled={filledCount} total={fields.length} />
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
                    {f.filled ? <Check className={`h-5 w-5 shrink-0 text-emerald-500`} /> : <Circle className={`h-5 w-5 shrink-0 text-ink-muted/30`} />}
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-lg">
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    label: "وبسایت",
                    value: effective.companyWebsite,
                    isLink: Boolean(effective.companyWebsite),
                  },
                  { label: "اندازه تیم", value: effective.companyTeamSize },
                  { label: "درباره شرکت", value: effective.companyDescription },
                ].map((row) => (
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
                            {row.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-ink">
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