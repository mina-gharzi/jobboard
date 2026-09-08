"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJobSchema, toStr } from "@/lib/validation";

export type CreateJobState = {
  errors: {
    form?: string;
    title?: string;
    description?: string;
    category?: string;
    city?: string;
    remoteType?: string;
    salaryMin?: string;
    salaryMax?: string;
  };
  values?: {
    title: string;
    description: string;
    category: string;
    city: string;
    remoteType: string;
    salaryMin: string;
    salaryMax: string;
  };
};

export async function createJob(
  _prevState: CreateJobState,
  formData: FormData
): Promise<CreateJobState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { errors: { form: "باید وارد شوید" } };
  }

  if (session.user.role !== "EMPLOYER") {
    return { errors: { form: "فقط کارفرماها می‌توانند آگهی ثبت کنند" } };
  }

  const rawValues = {
    title: toStr(formData.get("title")),
    description: toStr(formData.get("description")),
    category: toStr(formData.get("category")),
    city: toStr(formData.get("city")),
    remoteType: toStr(formData.get("remoteType")),
    salaryMin: toStr(formData.get("salaryMin")),
    salaryMax: toStr(formData.get("salaryMax")),
  };

  const parsed = createJobSchema.safeParse(rawValues);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: {
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        category: fieldErrors.category?.[0],
        city: fieldErrors.city?.[0],
        remoteType: fieldErrors.remoteType?.[0],
        salaryMin: fieldErrors.salaryMin?.[0],
        salaryMax: fieldErrors.salaryMax?.[0],
      },
      // مقادیری که کاربر تایپ کرده رو برمی‌گردونیم تا فرم بعد از ریست خودکار React خالی نشه
      values: rawValues,
    };
  }

  const { title, description, category, city, remoteType, salaryMin, salaryMax } =
    parsed.data;

  function slugify(value: string) {
    return value
      .trim()
      .replace(/\s+/g, "-") // فاصله‌ها به خط تیره
      .replace(/[\/\\?#%&=+:;"'<>]/g, "") // کاراکترهای ناامن برای URL
      .replace(/-+/g, "-"); // چند خط‌تیره‌ی پشت‌سرهم یکی بشه
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  await prisma.job.create({
    data: {
      employerId: session.user.id,
      title,
      slug,
      description,
      category,
      city,
      remoteType,
      salaryMin: salaryMin ?? null,
      salaryMax: salaryMax ?? null,
      status: "PUBLISHED",
    },
  });

  revalidatePath("/jobs");
  redirect("/jobs");
}