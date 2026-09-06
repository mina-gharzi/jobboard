export const remoteTypeLabels: Record<string, string> = {
  ONSITE: "حضوری",
  REMOTE: "دورکاری",
  HYBRID: "ترکیبی",
};

/**
 * فرض بر این است که مبلغ حقوق به تومان ذخیره شده است.
 * در صورت نیاز به واحد دیگر، فقط همین‌جا را تغییر بده.
 */
export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined
): string | null {
  if (!min && !max) return null;

  const fa = (n: number) => n.toLocaleString("fa-IR");

  if (min && max) {
    return `${fa(min)} تا ${fa(max)} تومان`;
  }
  if (min) {
    return `از ${fa(min)} تومان`;
  }
  if (max) {
    return `تا ${fa(max)} تومان`;
  }
  return null;
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  if (diffDays < 7) return `${diffDays} روز پیش`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;

  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
