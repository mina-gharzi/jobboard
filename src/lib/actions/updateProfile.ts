"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateProfileSchema, toStr } from "@/lib/validation";
import { deleteResumePdf, saveResumePdf } from "@/lib/resume";

export type UpdateProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    phone?: string;
    resumePdf?: string;
    bio?: string;
  };
  values?: {
    phone: string;
    bio: string;
    resumePdf: string | null;
  };
};

export async function updateCandidateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "باید وارد شوید" };
  }

  if (session.user.role !== "CANDIDATE") {
    return { error: "این بخش فقط برای کارجوهاست" };
  }

  const rawValues = {
    phone: toStr(formData.get("phone")),
    bio: toStr(formData.get("bio")),
  };

  const parsed = updateProfileSchema.safeParse(rawValues);

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        phone: fe.phone?.[0],
        bio: fe.bio?.[0],
      },
      values: { phone: rawValues.phone, bio: rawValues.bio, resumePdf: null },
    };
  }

  const { phone, bio } = parsed.data;
  const fileEntry = formData.get("resumePdf");
  const file = fileEntry instanceof File ? fileEntry : null;
  const shouldRemove = formData.get("removeResume") === "1";

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { error: "حساب کاربری یافت نشد" };
  }

  let resumePdf = user.resumePdf;

  if (file && file.size > 0) {
    try {
      resumePdf = await saveResumePdf(file, user.id);
      await deleteResumePdf(user.resumePdf);
    } catch (e) {
      return {
        fieldErrors: { resumePdf: e instanceof Error ? e.message : "خطایی در ذخیره‌ی فایل رخ داد" },
        values: { phone: phone ?? "", bio: bio ?? "", resumePdf: user.resumePdf },
      };
    }
  } else if (shouldRemove && resumePdf) {
    await deleteResumePdf(resumePdf);
    resumePdf = null;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone: phone || null,
      bio: bio || null,
      resumePdf,
    },
  });

  revalidatePath("/candidate/profile");
  revalidatePath("/candidate");

  return {
    success: true,
    values: { phone: phone ?? "", bio: bio ?? "", resumePdf },
  };
}