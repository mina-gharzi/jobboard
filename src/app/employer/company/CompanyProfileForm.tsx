"use client";

import { useActionState, useState } from "react";
import { COMPANY_TEAM_SIZES } from "@/lib/companyTeamSizes";
import {
  updateCompanyProfile,
  type UpdateCompanyProfileState,
} from "@/lib/actions/updateCompanyProfile";

const initialState: UpdateCompanyProfileState = {};

type Props = {
  name: string;
  logoUrl: string;
  companyDescription: string;
  companyWebsite: string;
  companyTeamSize: string;
};

export default function CompanyProfileForm({
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

  // بعد از ثبت موفق، از حالت ویرایش خارج شو — حین رندر (نه داخل
  // useEffect) تا رندر اضافه ایجاد نشه.
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.success) {
      setIsEditing(false);
    }
  }

  if (!isEditing) {
    return (
      <div>
        {state.success && (
          <p className="mb-5 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
            پروفایل شرکت با موفقیت به‌روزرسانی شد.
          </p>
        )}

        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-paper text-lg font-bold text-slate-dark">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              name.trim()[0] ?? "؟"
            )}
          </div>
          <p className="font-semibold text-ink">{name}</p>
        </div>

        <dl className="mt-5 flex flex-col gap-4">
          <div>
            <dt className="text-sm text-ink-muted">وب‌سایت</dt>
            <dd className="mt-1 text-sm">
              {companyWebsite ? (
                <a
                  href={companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate underline"
                >
                  {companyWebsite}
                </a>
              ) : (
                <span className="text-ink-muted">ثبت نشده</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink-muted">اندازه‌ی تیم</dt>
            <dd className="mt-1 text-sm text-ink">
              {companyTeamSize || <span className="text-ink-muted">ثبت نشده</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink-muted">درباره‌ی شرکت</dt>
            <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-ink">
              {companyDescription || <span className="text-ink-muted">ثبت نشده</span>}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-6 rounded-md border border-line px-5 py-2.5 text-sm text-ink transition hover:border-gold/40 hover:text-gold"
        >
          ویرایش اطلاعات
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isFirstTime && (
        <p className="rounded-md bg-gold/10 px-3 py-2 text-sm text-ink">
          این اولین باره که وارد پروفایل شرکتت شدی — اطلاعاتت رو کامل کن تا کارجوها بهتر بشناسنت.
        </p>
      )}
      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">نام شرکت</label>
        <input
          name="name"
          type="text"
          defaultValue={name}
          required
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">لینک لوگو</label>
        <input
          name="logoUrl"
          type="url"
          defaultValue={logoUrl}
          placeholder="لینک تصویر لوگوی شرکت"
          dir="ltr"
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.logoUrl && <p className="mt-1.5 text-sm text-danger">{errors.logoUrl}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">وب‌سایت شرکت</label>
        <input
          name="companyWebsite"
          type="url"
          defaultValue={companyWebsite}
          placeholder="https://example.com"
          dir="ltr"
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.companyWebsite && (
          <p className="mt-1.5 text-sm text-danger">{errors.companyWebsite}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">اندازه‌ی تیم</label>
        <select
          name="companyTeamSize"
          defaultValue={companyTeamSize}
          className="input-field w-full rounded-md border p-3 text-sm"
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
        <label className="mb-1.5 block text-sm text-ink-muted">درباره‌ی شرکت</label>
        <textarea
          name="companyDescription"
          defaultValue={companyDescription}
          rows={5}
          maxLength={800}
          placeholder="چند جمله درباره‌ی شرکت، حوزه‌ی فعالیت و فرهنگ کاریتون بنویسید..."
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.companyDescription && (
          <p className="mt-1.5 text-sm text-danger">{errors.companyDescription}</p>
        )}
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
  );
}
