import { RemoteType } from "@/generated/prisma";

export const remoteTypeLabels: Record<RemoteType, string> = {
  ONSITE: "حضوری",
  REMOTE: "دورکاری",
  HYBRID: "ترکیبی",
};

export const remoteTypeOptions = Object.values(RemoteType).map((value) => ({
  value,
  label: remoteTypeLabels[value],
}));

/**
 * فرض بر این است که مبلغ حقوق به تومان ذخیره شده است.
 * در صورت نیاز به واحد دیگر، فقط همین‌جا را تغییر بده.
 */
export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined
): string | null {
  if (min == null && max == null) return null;

  const fa = (n: number) => n.toLocaleString("fa-IR");

  if (min != null && max != null) {
    return `${fa(min)} تا ${fa(max)} تومان`;
  }
  if (min != null) {
    return `از ${fa(min)} تومان`;
  }
  return `تا ${fa(max as number)} تومان`;
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // عددها به ارقام فارسی — چون قالب بقیه‌ی اعداد سایت فارسی است.
  const fa = (n: number) => n.toLocaleString("fa-IR");

  if (diffDays <= 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  if (diffDays < 7) return `${fa(diffDays)} روز پیش`;
  if (diffDays < 30) return `${fa(Math.floor(diffDays / 7))} هفته پیش`;

  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
