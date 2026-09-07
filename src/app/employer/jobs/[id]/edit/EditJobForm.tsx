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
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.title && <p className="mt-1.5 text-sm text-danger">{errors.title}</p>}
      </div>

      <div>
        <textarea
          name="description"
          defaultValue={job.description}
          placeholder="توضیحات"
          rows={6}
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-danger">{errors.description}</p>
        )}
      </div>

      <div>
        <select
          name="category"
          defaultValue={job.category}
          className="input-field w-full rounded-md border p-3 text-sm"
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
          className="input-field w-full rounded-md border p-3 text-sm"
        />
        {errors.city && <p className="mt-1.5 text-sm text-danger">{errors.city}</p>}
      </div>

      <div>
        <select
          name="remoteType"
          defaultValue={job.remoteType}
          className="input-field w-full rounded-md border p-3 text-sm"
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
            defaultValue={job.salaryMin ?? ""}
            placeholder="حداقل حقوق"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          {errors.salaryMin && (
            <p className="mt-1.5 text-sm text-danger">{errors.salaryMin}</p>
          )}
        </div>
        <div>
          <input
            name="salaryMax"
            type="number"
            defaultValue={job.salaryMax ?? ""}
            placeholder="حداکثر حقوق"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          {errors.salaryMax && (
            <p className="mt-1.5 text-sm text-danger">{errors.salaryMax}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">وضعیت آگهی</label>
        <select
          name="status"
          defaultValue={job.status}
          className="input-field w-full rounded-md border p-3 text-sm"
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
        className="btn-primary rounded-md py-3 text-sm disabled:opacity-50"
      >
        {isPending ? "در حال ذخیره..." : "ذخیره‌ی تغییرات"}
      </button>
    </form>
  );
}
