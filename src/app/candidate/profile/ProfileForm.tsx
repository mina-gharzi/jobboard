"use client";

import { useActionState, useState } from "react";
import {
  updateCandidateProfile,
  type UpdateProfileState,
} from "@/lib/actions/updateProfile";

const initialState: UpdateProfileState = {};

type Props = {
  phone: string;
  resumeUrl: string;
  bio: string;
  /**
   * اگر true باشد، فرم بدون توجه به خالی بودن فیلدها مستقیماً در حالت
   * ویرایش شروع می‌شود (مناسب صفحه‌ی «ویرایش پروفایل» مجزا).
   */
  startEditing?: boolean;
};

export default function ProfileForm({ phone, resumeUrl, bio, startEditing }: Props) {
  const isFirstTime = !phone && !resumeUrl && !bio;
  const [isEditing, setIsEditing] = useState(startEditing ?? isFirstTime);
  const [state, formAction, isPending] = useActionState(
    updateCandidateProfile,
    initialState
  );
  const errors = state.fieldErrors ?? {};

  // بعد از ثبت موفق، از حالت ویرایش خارج شو و نمایش خلاصه رو نشون بده.
  // این کار به‌جای useEffect، حین رندر انجام می‌شود (الگوی توصیه‌شده‌ی
  // React برای "adjusting state when a prop/value changes")، چون فراخوانی
  // setState داخل useEffect باعث یک رندر اضافه‌ی غیرضروری می‌شود.
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
            پروفایل با موفقیت به‌روزرسانی شد.
          </p>
        )}

        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-sm text-ink-muted">شماره تماس</dt>
            <dd className="mt-1 text-sm text-ink" dir="ltr">
              {phone || <span className="text-ink-muted">ثبت نشده</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink-muted">لینک رزومه</dt>
            <dd className="mt-1 text-sm">
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate underline"
                >
                  {resumeUrl}
                </a>
              ) : (
                <span className="text-ink-muted">ثبت نشده</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink-muted">معرفی کوتاه</dt>
            <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-ink">
              {bio || <span className="text-ink-muted">ثبت نشده</span>}
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
          این اولین باره که وارد پروفایلت شدی — اطلاعاتت رو کامل کن تا کارفرماها بهتر بشناسنت.
        </p>
      )}
      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">شماره تماس</label>
        <input
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="مثلاً 09123456789"
          dir="ltr"
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.phone && <p className="mt-1.5 text-sm text-danger">{errors.phone}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">لینک رزومه</label>
        <input
          name="resumeUrl"
          type="url"
          defaultValue={resumeUrl}
          placeholder="لینک رزومه، لینکدین یا نمونه‌کار (Google Drive، LinkedIn و ...)"
          dir="ltr"
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.resumeUrl && (
          <p className="mt-1.5 text-sm text-danger">{errors.resumeUrl}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">معرفی کوتاه</label>
        <textarea
          name="bio"
          defaultValue={bio}
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
  );
}
