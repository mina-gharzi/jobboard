"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateCompanyProfileSchema, toStr } from "@/lib/validation";

export type UpdateCompanyProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    companyDescription?: string;
    companyWebsite?: string;
    companyTeamSize?: string;
    logoUrl?: string;
  };
};

export async function updateCompanyProfile(
  _prevState: UpdateCompanyProfileState,
  formData: FormData
): Promise<UpdateCompanyProfileState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "باید وارد شوید" };
  }

  if (session.user.role !== "EMPLOYER") {
    return { error: "این بخش فقط برای کارفرماهاست" };
  }

  const parsed = updateCompanyProfileSchema.safeParse({
    name: toStr(formData.get("name")),
    companyDescription: toStr(formData.get("companyDescription")),
    companyWebsite: toStr(formData.get("companyWebsite")),
    companyTeamSize: toStr(formData.get("companyTeamSize")),
    logoUrl: toStr(formData.get("logoUrl")),
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        name: fe.name?.[0],
        companyDescription: fe.companyDescription?.[0],
        companyWebsite: fe.companyWebsite?.[0],
        companyTeamSize: fe.companyTeamSize?.[0],
        logoUrl: fe.logoUrl?.[0],
      },
    };
  }

  const { name, companyDescription, companyWebsite, companyTeamSize, logoUrl } =
    parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      companyDescription: companyDescription || null,
      companyWebsite: companyWebsite || null,
      companyTeamSize: companyTeamSize || null,
      image: logoUrl || null,
    },
  });

  // اسم و لوگوی شرکت روی کارت آگهی‌ها هم نمایش داده می‌شه، پس صفحات
  // مرتبط هم باید رفرش بشن.
  revalidatePath("/employer/company");
  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath("/");

  return { success: true };
}
