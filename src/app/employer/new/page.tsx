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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">ثبت آگهی جدید</h1>

      <form action={createJob} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="عنوان شغل"
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <textarea
          name="description"
          placeholder="توضیحات"
          required
          rows={6}
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <input
          name="category"
          placeholder="دسته‌بندی (مثلاً فرانت‌اند)"
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <input
          name="city"
          placeholder="شهر"
          required
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        />
        <select
          name="remoteType"
          required
          defaultValue=""
          className="rounded-md border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="" disabled>نوع همکاری را انتخاب کنید</option>
          <option value="ONSITE">حضوری</option>
          <option value="REMOTE">دورکاری</option>
          <option value="HYBRID">ترکیبی</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-gray-900 py-3 text-sm text-white hover:bg-gray-800"
        >
          ثبت آگهی
        </button>
      </form>
    </div>
  );
}