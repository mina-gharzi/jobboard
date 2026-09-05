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

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        درخواست‌های آگهی: {job.title}
      </h1>

      {job.applications.length === 0 ? (
        <p className="text-gray-500">هنوز کسی برای این آگهی اپلای نکرده است.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {job.applications.map((app) => (
            <li key={app.id} className="rounded-lg border border-gray-200 p-5">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs ${statusColors[app.status]}`}
              >
                {statusLabels[app.status]}
              </span>

              {app.coverLetter && (
                <p className="mt-3 text-sm text-gray-700">{app.coverLetter}</p>
              )}

              <form
                action={updateApplicationStatus}
                className="mt-4 flex items-center gap-3"
              >
                <input type="hidden" name="applicationId" value={app.id} />
                <select
                  name="status"
                  defaultValue={app.status}
                  className="rounded-md border border-gray-300 p-2 text-sm focus:border-gray-500 focus:outline-none"
                >
                  <option value="PENDING">در انتظار بررسی</option>
                  <option value="REVIEWED">بررسی‌شده</option>
                  <option value="ACCEPTED">پذیرفته‌شده</option>
                  <option value="REJECTED">رد‌شده</option>
                </select>
                <button
                  type="submit"
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  ثبت تغییر وضعیت
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
