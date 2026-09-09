import { redirect } from "next/navigation";

// این صفحه حذف شده و ادغام شده تو /employer/company (نمایش و ویرایش
// الان تو یه صفحه‌ی واحده). این redirect فقط برای لینک‌های قدیمی نگه داشته شده.
export default function CompanyProfileEditRedirect() {
  redirect("/employer/company");
}