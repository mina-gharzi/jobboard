import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/noto-kufi-arabic/500.css";
import "@fontsource/noto-kufi-arabic/700.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Job Board",
  description: "پلتفرم آگهی‌های استخدام",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-paper font-body text-ink">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
