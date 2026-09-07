"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJobSchema, toStr } from "@/lib/validation";

export async function createJob(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("باید وارد شوید");
  }

  if (session.user.role !== "EMPLOYER") {
    throw new Error("فقط کارفرماها می‌توانند آگهی ثبت کنند");
  }

  const parsed = createJobSchema.safeParse({
    title: toStr(formData.get("title")),
    description: toStr(formData.get("description")),
    category: toStr(formData.get("category")),
    city: toStr(formData.get("city")),
    remoteType: toStr(formData.get("remoteType")),
    salaryMin: toStr(formData.get("salaryMin")),
    salaryMax: toStr(formData.get("salaryMax")),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
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
