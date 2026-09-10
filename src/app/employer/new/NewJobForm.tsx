"use client";

import { useActionState } from "react";
import { createJob, type CreateJobState } from "@/lib/actions/createJob";
import { remoteTypeOptions } from "@/lib/format";
import { JOB_CATEGORIES } from "@/lib/categories";

const initialState: CreateJobState = { errors: {} };

export default function NewJobForm() {
  const [state, formAction, isPending] = useActionState(
    createJob,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5"
    >
      {state.errors.form && (
        <p className="text-sm text-danger">{state.errors.form}</p>
      )}

      <div>
        <label htmlFor="job-title" className="mb-1.5 block text-sm font-semibold text-ink-muted">عنوان شغل</label>
        <input
          id="job-title"
          name="title"
          defaultValue={state.values?.title ?? ""}
          placeholder="مثلاً توسعه‌دهنده‌ی فرانت‌اند"
          required
          minLength={3}
          maxLength={150}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
        {state.errors.title && (
          <p className="mt-1.5 text-sm text-danger">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="job-desc" className="mb-1.5 block text-sm font-semibold text-ink-muted">توضیحات</label>
        <textarea
          id="job-desc"
          name="description"
          defaultValue={state.values?.description ?? ""}
          placeholder="شرح موقعیت شغلی، مهارت‌های مورد نیاز و..."
          rows={6}
          required
          minLength={20}
          maxLength={5000}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
        {state.errors.description && (
          <p className="mt-1.5 text-sm text-danger">
            {state.errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="job-category" className="mb-1.5 block text-sm font-semibold text-ink-muted">
            دسته‌بندی
          </label>
          <select
            id="job-category"
            name="category"
            defaultValue={state.values?.category ?? ""}
            required
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {state.errors.category && (
            <p className="mt-1.5 text-sm text-danger">
              {state.errors.category}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="job-city" className="mb-1.5 block text-sm font-semibold text-ink-muted">شهر</label>
          <input
            id="job-city"
            name="city"
            defaultValue={state.values?.city ?? ""}
            placeholder="مثلاً تهران"
            required
            minLength={2}
            maxLength={100}
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          />
          {state.errors.city && (
            <p className="mt-1.5 text-sm text-danger">{state.errors.city}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="job-remote" className="mb-1.5 block text-sm font-semibold text-ink-muted">
          نوع همکاری
        </label>
        <select
          id="job-remote"
          name="remoteType"
          defaultValue={state.values?.remoteType ?? ""}
          required
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        >
          <option value="" disabled>
            انتخاب کنید
          </option>
          {remoteTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {state.errors.remoteType && (
          <p className="mt-1.5 text-sm text-danger">
            {state.errors.remoteType}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="job-salary-min" className="mb-1.5 block text-sm font-semibold text-ink-muted">
            حداقل حقوق (تومان)
          </label>
          <input
            id="job-salary-min"
            name="salaryMin"
            type="number"
            min={0}
            defaultValue={state.values?.salaryMin ?? ""}
            placeholder="اختیاری"
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          />
          {state.errors.salaryMin && (
            <p className="mt-1.5 text-sm text-danger">
              {state.errors.salaryMin}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="job-salary-max" className="mb-1.5 block text-sm font-semibold text-ink-muted">
            حداکثر حقوق (تومان)
          </label>
          <input
            id="job-salary-max"
            name="salaryMax"
            type="number"
            min={0}
            defaultValue={state.values?.salaryMax ?? ""}
            placeholder="اختیاری"
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          />
          {state.errors.salaryMax && (
            <p className="mt-1.5 text-sm text-danger">
              {state.errors.salaryMax}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isPending ? "در حال ثبت..." : "ثبت آگهی"}
      </button>
    </form>
  );
}