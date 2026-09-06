import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createJob } from "@/lib/actions/createJob";

export default async function NewJobPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "EMPLOYER") redirect("/jobs");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-ink">ثبت آگهی جدید</h1>
      <p className="mt-1 text-sm text-ink-muted">
        اطلاعات زیر برای همه‌ی کارجوها قابل‌مشاهده خواهد بود.
      </p>

      <form
        action={createJob}
        className="mt-8 flex flex-col gap-6 rounded-2xl border border-line bg-white/70 p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">عنوان شغل</label>
          <input
            name="title"
            placeholder="مثلاً توسعه‌دهنده‌ی فرانت‌اند"
            required
            className="input-field w-full rounded-md border p-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">توضیحات</label>
          <textarea
            name="description"
            placeholder="شرح موقعیت شغلی، مهارت‌های مورد نیاز و..."
            required
            rows={6}
            className="input-field w-full rounded-md border p-3 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-ink-muted">دسته‌بندی</label>
            <input
              name="category"
              placeholder="مثلاً فرانت‌اند"
              required
              className="input-field w-full rounded-md border p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-muted">شهر</label>
            <input
              name="city"
              placeholder="مثلاً تهران"
              required
              className="input-field w-full rounded-md border p-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">نوع همکاری</label>
          <select
            name="remoteType"
            required
            defaultValue=""
            className="input-field w-full rounded-md border p-3 text-sm"
          >
            <option value="" disabled>انتخاب کنید</option>
            <option value="ONSITE">حضوری</option>
            <option value="REMOTE">دورکاری</option>
            <option value="HYBRID">ترکیبی</option>
          </select>
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
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-muted">حداکثر حقوق (تومان)</label>
            <input
              name="salaryMax"
              type="number"
              placeholder="اختیاری"
              className="input-field w-full rounded-md border p-3 text-sm"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary rounded-md py-3 text-sm">
          ثبت آگهی
        </button>
      </form>
    </div>
  );
}