"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("باید وارد شوید");
  }

  if (session.user.role !== "EMPLOYER") {
    throw new Error("فقط کارفرماها می‌توانند آگهی ثبت کنند");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const city = formData.get("city") as string;
  const remoteType = formData.get("remoteType") as string;

  if (!title || !description || !category || !city || !remoteType) {
    throw new Error("همه‌ی فیلدها الزامی هستند");
  }

  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "") + "-" + Date.now().toString(36);

  await prisma.job.create({
    data: {
      employerId: session.user.id,
      title,
      slug,
      description,
      category,
      city,
      remoteType: remoteType as "ONSITE" | "REMOTE" | "HYBRID",
      status: "PUBLISHED",
    },
  });

  revalidatePath("/jobs");
  redirect("/jobs");
}