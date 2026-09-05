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
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>ثبت آگهی جدید</h1>
      <form action={createJob}>
        <input name="title" placeholder="عنوان شغل" required />
        <textarea name="description" placeholder="توضیحات" required rows={6} />
        <input
          name="category"
          placeholder="دسته‌بندی (مثلاً فرانت‌اند)"
          required
        />
        <input name="city" placeholder="شهر" required />
        <select name="remoteType" required defaultValue="">
          <option value="" disabled>
            نوع همکاری را انتخاب کنید
          </option>
          <option value="ONSITE">حضوری</option>
          <option value="REMOTE">دورکاری</option>
          <option value="HYBRID">ترکیبی</option>
        </select>
        <button type="submit">ثبت آگهی</button>
      </form>
    </div>
  );
}
