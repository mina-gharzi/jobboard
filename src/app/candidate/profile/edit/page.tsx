import { redirect } from "next/navigation";

// این صفحه حذف شده و ادغام شده تو /candidate/profile (نمایش و ویرایش
// الان تو یه صفحه‌ی واحده). این redirect فقط برای لینک‌های قدیمی نگه داشته شده.
export default function CandidateProfileEditRedirect() {
  redirect("/candidate/profile");
}