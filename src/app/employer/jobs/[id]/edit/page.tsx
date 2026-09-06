import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { updateJob, deleteJob } from "@/lib/actions/manageJob";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.employerId !== session.user.id) {
    notFound();
  }

  const updateJobWithId = updateJob.bind(null, job.id);
  const deleteJobWithId = deleteJob.bind(null, job.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">ویرایش آگهی</h1>

      <form action={updateJobWithId} className="flex flex-col gap-4">
        <input
          name="title"
          defaultValue={job.title}
          placeholder="عنوان شغل"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <textarea
          name="description"
          defaultValue={job.description}
          placeholder="توضیحات"
          required
          rows={6}
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          name="category"
          defaultValue={job.category}
          placeholder="دسته‌بندی"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          name="city"
          defaultValue={job.city}
          placeholder="شهر"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <select
          name="remoteType"
          defaultValue={job.remoteType}
          required
          className="input-field rounded-md border p-3 text-sm"
        >
          <option value="ONSITE">حضوری</option>
          <option value="REMOTE">دورکاری</option>
          <option value="HYBRID">ترکیبی</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="salaryMin"
            type="number"
            defaultValue={job.salaryMin ?? ""}
            placeholder="حداقل حقوق"
            className="input-field rounded-md border p-3 text-sm"
          />
          <input
            name="salaryMax"
            type="number"
            defaultValue={job.salaryMax ?? ""}
            placeholder="حداکثر حقوق"
            className="input-field rounded-md border p-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">وضعیت آگهی</label>
          <select
            name="status"
            defaultValue={job.status}
            required
            className="input-field rounded-md border p-3 text-sm"
          >
            <option value="DRAFT">پیش‌نویس (نامرئی برای عموم)</option>
            <option value="PUBLISHED">منتشرشده</option>
            <option value="CLOSED">بسته‌شده</option>
          </select>
        </div>

        <button type="submit" className="btn-primary rounded-md py-3 text-sm">
          ذخیره‌ی تغییرات
        </button>
      </form>

      <form action={deleteJobWithId} className="mt-4">
        <button
          type="submit"
          className="w-full rounded-md border border-danger py-3 text-sm text-danger hover:bg-danger/5"
        >
          حذف این آگهی
        </button>
      </form>
    </div>
  );
}