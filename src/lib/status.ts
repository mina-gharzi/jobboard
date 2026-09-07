import { JobStatus, ApplicationStatus } from "@/generated/prisma/enums";

export const jobStatusLabels: Record<JobStatus, string> = {
  DRAFT: "پیش‌نویس",
  PUBLISHED: "منتشرشده",
  CLOSED: "بسته‌شده",
};

export const jobStatusBadge: Record<JobStatus, string> = {
  DRAFT: "badge badge-neutral",
  PUBLISHED: "badge badge-accepted",
  CLOSED: "badge badge-rejected",
};

export const jobStatusOptions = Object.values(JobStatus).map((value) => ({
  value,
  label: jobStatusLabels[value],
}));

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  PENDING: "در انتظار بررسی",
  REVIEWED: "بررسی‌شده",
  ACCEPTED: "پذیرفته‌شده",
  REJECTED: "رد‌شده",
};

export const applicationStatusBadge: Record<ApplicationStatus, string> = {
  PENDING: "badge badge-pending",
  REVIEWED: "badge badge-reviewed",
  ACCEPTED: "badge badge-accepted",
  REJECTED: "badge badge-rejected",
};

export const applicationStatusOptions = Object.values(ApplicationStatus).map(
  (value) => ({ value, label: applicationStatusLabels[value] })
);
