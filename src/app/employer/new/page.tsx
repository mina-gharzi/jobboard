import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createJob } from "@/lib/actions/createJob";

export default async function NewJobPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/jobs");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">ثبت آگهی جدید</h1>

      <form action={createJob} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="عنوان شغل"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <textarea
          name="description"
          placeholder="توضیحات"
          required
          rows={6}
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          name="category"
          placeholder="دسته‌بندی (مثلاً فرانت‌اند)"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <input
          name="city"
          placeholder="شهر"
          required
          className="input-field rounded-md border p-3 text-sm"
        />
        <div className="flex gap-3">
          <input
            name="salaryMin"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="حداقل حقوق (تومان، اختیاری)"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
          <input
            name="salaryMax"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="حداکثر حقوق (تومان، اختیاری)"
            className="input-field w-full rounded-md border p-3 text-sm"
          />
        </div>
        <select
          name="remoteType"
          required
          defaultValue=""
          className="input-field rounded-md border p-3 text-sm"
        >
          <option value="" disabled>نوع همکاری را انتخاب کنید</option>
          <option value="ONSITE">حضوری</option>
          <option value="REMOTE">دورکاری</option>
          <option value="HYBRID">ترکیبی</option>
        </select>
        <button type="submit" className="btn-primary rounded-md py-3 text-sm">
          ثبت آگهی
        </button>
      </form>
    </div>
  );
}