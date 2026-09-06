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
        include: {
          candidate: { select: { name: true, email: true, image: true } },
        },
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

  const statusBadgeClasses: Record<string, string> = {
    PENDING: "badge badge-pending",
    REVIEWED: "badge badge-reviewed",
    ACCEPTED: "badge badge-accepted",
    REJECTED: "badge badge-rejected",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">
        درخواست‌های آگهی: {job.title}
      </h1>

      {job.applications.length === 0 ? (
        <p className="text-ink-muted">هنوز کسی برای این آگهی اپلای نکرده است.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {job.applications.map((app) => (
            <li key={app.id} className="rounded-lg border border-line p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate/10 text-sm font-bold text-slate-dark">
                    {app.candidate.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.candidate.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      app.candidate.name.trim()[0] ?? "؟"
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{app.candidate.name}</p>
                    <p className="text-sm text-ink-muted" dir="ltr">
                      {app.candidate.email}
                    </p>
                  </div>
                </div>
                <span className={statusBadgeClasses[app.status]}>
                  {statusLabels[app.status]}
                </span>
              </div>

              {app.coverLetter && (
                <p className="mt-3 text-sm text-ink">{app.coverLetter}</p>
              )}

              <form
                action={updateApplicationStatus}
                className="mt-4 flex items-center gap-3"
              >
                <input type="hidden" name="applicationId" value={app.id} />
                <select
                  name="status"
                  defaultValue={app.status}
                  className="input-field rounded-md border p-2 text-sm"
                >
                  <option value="PENDING">در انتظار بررسی</option>
                  <option value="REVIEWED">بررسی‌شده</option>
                  <option value="ACCEPTED">پذیرفته‌شده</option>
                  <option value="REJECTED">رد‌شده</option>
                </select>
                <button type="submit" className="btn-primary rounded-md px-4 py-2 text-sm">
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
