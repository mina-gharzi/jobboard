"use client";

import { useActionState } from "react";
import { updateJob, type UpdateJobState } from "@/lib/actions/manageJob";
import { jobStatusOptions } from "@/lib/status";
import { remoteTypeOptions } from "@/lib/format";
import { JOB_CATEGORIES } from "@/lib/categories";
import type { RemoteType, JobStatus } from "@/generated/prisma/enums";

const initialState: UpdateJobState = {};

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  remoteType: RemoteType;
  status: JobStatus;
  salaryMin: number | null;
  salaryMax: number | null;
};

export default function EditJobForm({ job }: { job: Job }) {
  const updateJobWithId = updateJob.bind(null, job.id);
  const [state, formAction, isPending] = useActionState(updateJobWithId, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <input
          name="title"
          defaultValue={job.title}
          placeholder="عنوان شغل"
          aria-label="عنوان شغل"
          required
          minLength={3}
          maxLength={150}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
        {errors.title && <p className="mt-1.5 text-sm text-danger">{errors.title}</p>}
      </div>

      <div>
        <textarea
          name="description"
          defaultValue={job.description}
          placeholder="توضیحات"
          aria-label="توضیحات"
          rows={6}
          required
          minLength={20}
          maxLength={5000}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-danger">{errors.description}</p>
        )}
      </div>

      <div>
        <select
          name="category"
          defaultValue={job.category}
          aria-label="دسته‌بندی"
          required
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        >
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1.5 text-sm text-danger">{errors.category}</p>}
      </div>

      <div>
        <input
          name="city"
          defaultValue={job.city}
          placeholder="شهر"
          aria-label="شهر"
          required
          minLength={2}
          maxLength={100}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        />
        {errors.city && <p className="mt-1.5 text-sm text-danger">{errors.city}</p>}
      </div>

      <div>
        <select
          name="remoteType"
          defaultValue={job.remoteType}
          aria-label="نوع همکاری"
          required
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        >
          {remoteTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.remoteType && (
          <p className="mt-1.5 text-sm text-danger">{errors.remoteType}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            name="salaryMin"
            type="number"
            min={0}
            defaultValue={job.salaryMin ?? ""}
            placeholder="حداقل حقوق"
            aria-label="حداقل حقوق"
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          />
          {errors.salaryMin && (
            <p className="mt-1.5 text-sm text-danger">{errors.salaryMin}</p>
          )}
        </div>
        <div>
          <input
            name="salaryMax"
            type="number"
            min={0}
            defaultValue={job.salaryMax ?? ""}
            placeholder="حداکثر حقوق"
            aria-label="حداکثر حقوق"
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
          />
          {errors.salaryMax && (
            <p className="mt-1.5 text-sm text-danger">{errors.salaryMax}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="edit-status" className="mb-1.5 block text-sm font-semibold text-ink-muted">وضعیت آگهی</label>
        <select
          id="edit-status"
          name="status"
          defaultValue={job.status}
          required
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 shadow-sm backdrop-blur transition focus:border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/10"
        >
          {jobStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value === "DRAFT" ? `${opt.label} (نامرئی برای عموم)` : opt.label}
            </option>
          ))}
        </select>
        {errors.status && <p className="mt-1.5 text-sm text-danger">{errors.status}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isPending ? "در حال ذخیره..." : "ذخیره‌ی تغییرات"}
      </button>
    </form>
  );
}