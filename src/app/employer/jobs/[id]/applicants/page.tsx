import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { updateApplicationStatus } from "@/lib/actions/updateApplicationStatus";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ApplicantsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/jobs");
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job || job.employerId !== session.user.id) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    PENDING: "در انتظار بررسی",
    REVIEWED: "بررسی‌شده",
    ACCEPTED: "پذیرفته‌شده",
    REJECTED: "رد‌شده",
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>درخواست‌های آگهی: {job.title}</h1>

      {job.applications.length === 0 ? (
        <p>هنوز کسی برای این آگهی اپلای نکرده است.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {job.applications.map((app) => (
            <li key={app.id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
              <p>وضعیت فعلی: <strong>{statusLabels[app.status]}</strong></p>
              {app.coverLetter && <p>انگیزه‌نامه: {app.coverLetter}</p>}

              <form action={updateApplicationStatus}>
                <input type="hidden" name="applicationId" value={app.id} />
                <select name="status" defaultValue={app.status}>
                  <option value="PENDING">در انتظار بررسی</option>
                  <option value="REVIEWED">بررسی‌شده</option>
                  <option value="ACCEPTED">پذیرفته‌شده</option>
                  <option value="REJECTED">رد‌شده</option>
                </select>
                <button type="submit">ثبت تغییر وضعیت</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}