"use client";

import { useActionState } from "react";
import { createJob, type CreateJobState } from "@/lib/actions/createJob";
import { remoteTypeOptions } from "@/lib/format";
import { JOB_CATEGORIES } from "@/lib/categories";

const initialState: CreateJobState = { errors: {} };

export default function NewJobForm() {
  const [state, formAction, isPending] = useActionState(createJob, initialState);

  return (
    <form
      action={formAction}
      className="mt-8 flex flex-col gap-6 rounded-2xl border border-line bg-white/70 p-6"
    >
      {state.errors.form && (
        <p className="text-sm text-danger">{state.errors.form}</p>
      )}

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">عنوان شغل</label>
        <input
          name="title"
          placeholder="مثلاً توسعه‌دهنده‌ی فرانت‌اند"
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {state.errors.title && (
          <p className="mt-1.5 text-sm text-danger">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">توضیحات</label>
        <textarea
          name="description"
          placeholder="شرح موقعیت شغلی، مهارت‌های مورد نیاز و..."
          rows={6}
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {state.errors.description && (
          <p className="mt-1.5 text-sm text-danger">{state.errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">دسته‌بندی</label>
          <select
            name="category"
            defaultValue=""
            className="input-field w-full rounded-md border p-3 text-sm"
          >
            <option value="" disabled>انتخاب کنید</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {state.errors.category && (
            <p className="mt-1.5 text-sm text-danger">{state.errors.category}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">شهر</label>
          <input
            name="city"
            placeholder="مثلاً تهران"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          {state.errors.city && (
            <p className="mt-1.5 text-sm text-danger">{state.errors.city}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">نوع همکاری</label>
        <select
          name="remoteType"
          defaultValue=""
          className="input-field w-full rounded-md border p-3 text-sm"
        >
          <option value="" disabled>انتخاب کنید</option>
          {remoteTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {state.errors.remoteType && (
          <p className="mt-1.5 text-sm text-danger">{state.errors.remoteType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">حداقل حقوق (تومان)</label>
          <input
            name="salaryMin"
            type="number"
            placeholder="اختیاری"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          {state.errors.salaryMin && (
            <p className="mt-1.5 text-sm text-danger">{state.errors.salaryMin}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">حداکثر حقوق (تومان)</label>
          <input
            name="salaryMax"
            type="number"
            placeholder="اختیاری"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          {state.errors.salaryMax && (
            <p className="mt-1.5 text-sm text-danger">{state.errors.salaryMax}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
      >
        {isPending ? "در حال ثبت..." : "ثبت آگهی"}
      </button>
    </form>
  );
}
