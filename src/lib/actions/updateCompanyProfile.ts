"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateCompanyProfileSchema, toStr } from "@/lib/validation";
import { saveCompanyLogo, deleteCompanyLogo } from "@/lib/logo";

export type UpdateCompanyProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    companyDescription?: string;
    companyWebsite?: string;
    companyTeamSize?: string;
  };
  values?: {
    name: string;
    companyDescription: string;
    companyWebsite: string;
    companyTeamSize: string;
    logoUrl: string;
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

  const rawValues = {
    name: toStr(formData.get("name")),
    companyDescription: toStr(formData.get("companyDescription")),
    companyWebsite: toStr(formData.get("companyWebsite")),
    companyTeamSize: toStr(formData.get("companyTeamSize")),
  };

  const parsed = updateCompanyProfileSchema.safeParse(rawValues);

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        name: fe.name?.[0],
        companyDescription: fe.companyDescription?.[0],
        companyWebsite: fe.companyWebsite?.[0],
        companyTeamSize: fe.companyTeamSize?.[0],
      },
      values: { ...rawValues, logoUrl: "" },
    };
  }

  const { name, companyDescription, companyWebsite, companyTeamSize } =
    parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { error: "حساب کاربری یافت نشد" };
  }

  let logoUrl = user.image;
  const fileEntry = formData.get("logoFile");
  const file = fileEntry instanceof File ? fileEntry : null;
  const shouldRemoveLogo = formData.get("removeLogo") === "1";

  if (file && file.size > 0) {
    try {
      const newUrl = await saveCompanyLogo(file, session.user.id);
      await deleteCompanyLogo(user.image);
      logoUrl = newUrl;
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "خطایی در ذخیره‌ی لوگو رخ داد",
        values: { ...rawValues, logoUrl: user.image ?? "" },
      };
    }
  } else if (shouldRemoveLogo && logoUrl) {
    await deleteCompanyLogo(logoUrl);
    logoUrl = null;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      companyDescription: companyDescription || null,
      companyWebsite: companyWebsite || null,
      companyTeamSize: companyTeamSize || null,
      image: logoUrl,
    },
  });

  revalidatePath("/employer/company");
  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath("/");

  return {
    success: true,
    values: {
      name,
      companyDescription: companyDescription ?? "",
      companyWebsite: companyWebsite ?? "",
      companyTeamSize: companyTeamSize ?? "",
      logoUrl: logoUrl ?? "",
    },
  };
}
