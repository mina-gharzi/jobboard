"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateProfileSchema, toStr } from "@/lib/validation";

export type UpdateProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    phone?: string;
    resumeUrl?: string;
    bio?: string;
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

  const parsed = updateProfileSchema.safeParse({
    phone: toStr(formData.get("phone")),
    resumeUrl: toStr(formData.get("resumeUrl")),
    bio: toStr(formData.get("bio")),
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        phone: fe.phone?.[0],
        resumeUrl: fe.resumeUrl?.[0],
        bio: fe.bio?.[0],
      },
    };
  }

  const { phone, resumeUrl, bio } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone: phone || null,
      resumeUrl: resumeUrl || null,
      bio: bio || null,
    },
  });

  revalidatePath("/candidate/profile");
  revalidatePath("/candidate");

  return { success: true };
}
