export type JobData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  city: string;
  remoteType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: Date;
  employer?: { name: string | null; image: string | null } | null;
};