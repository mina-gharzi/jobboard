import { RemoteType } from "@/generated/prisma/enums";
import { remoteTypeLabels } from "@/lib/format";
import type { Prisma } from "@/generated/prisma/client";

/* ───────── فیلتر نوع همکاری ───────── */

export const REMOTE_FILTERS = [
  { value: "all", label: "همه" },
  { value: RemoteType.ONSITE, label: remoteTypeLabels[RemoteType.ONSITE] },
  { value: RemoteType.REMOTE, label: remoteTypeLabels[RemoteType.REMOTE] },
  { value: RemoteType.HYBRID, label: remoteTypeLabels[RemoteType.HYBRID] },
];

export function parseRemote(raw: string | undefined): RemoteType | null {
  if (
    raw === RemoteType.ONSITE ||
    raw === RemoteType.REMOTE ||
    raw === RemoteType.HYBRID
  ) {
    return raw;
  }
  return null;
}

/* ───────── فیلتر بازه‌ی حقوق (تومان) ───────── */

export const SALARY_RANGES = [
  { value: "all", label: "هر بازه‌ای", min: 0, max: Infinity, chipLabel: null },
  { value: "10", label: "زیر ۱۰ میلیون", min: 0, max: 10_000_000, chipLabel: "زیر ۱۰ میلیون" },
  { value: "30", label: "۱۰ تا ۳۰ میلیون", min: 10_000_000, max: 30_000_000, chipLabel: "۱۰ تا ۳۰ میلیون" },
  { value: "50", label: "۳۰ تا ۵۰ میلیون", min: 30_000_000, max: 50_000_000, chipLabel: "۳۰ تا ۵۰ میلیون" },
  { value: "100", label: "۵۰ تا ۱۰۰ میلیون", min: 50_000_000, max: 100_000_000, chipLabel: "۵۰ تا ۱۰۰ میلیون" },
  { value: "100+", label: "بیشتر از ۱۰۰ میلیون", min: 100_000_000, max: Infinity, chipLabel: "بیشتر از ۱۰۰ میلیون" },
] as const;

export type SalaryRange = (typeof SALARY_RANGES)[number];

export function parseSalaryKey(raw: string | undefined): SalaryRange | null {
  const range = SALARY_RANGES.find((r) => r.value === raw);
  return range && range.value !== "all" ? range : null;
}

/**
 * آگهی وقتی با بازه‌ی [min, max] تطبیق دارد که بازه‌ی حقوقش با آن هم‌پوشانی
 * داشته باشد؛ آگهی‌های بدون حقوق (هر دو فیلد null) حذف می‌شوند.
 */
export function salaryWhere(range: SalaryRange): Prisma.JobWhereInput {
  const andConditions: Prisma.JobWhereInput[] = [
    {
      OR: [
        { salaryMin: { not: null } },
        { salaryMax: { not: null } },
      ],
    },
    {
      OR: [
        { salaryMax: { gte: range.min } },
        // آگهی که فقط «حقوق از X» دارد، سقف مشخصی ندارد → خودِ حقوق شروع را بررسی می‌کنیم
        { salaryMax: null, salaryMin: { gte: range.min } },
      ],
    },
  ];

  if (range.max !== Infinity) {
    andConditions.push({
      OR: [
        { salaryMin: { lte: range.max } },
        // آگهی که فقط «حقوق تا Y» دارد، کف مشخصی ندارد → خودِ حقوق پایان را بررسی می‌کنیم
        { salaryMin: null, salaryMax: { lte: range.max } },
      ],
    });
  }

  return { AND: andConditions };
}