import type { Metadata } from "next";

export const metadata: Metadata = { title: "فراموشی رمز عبور | جابینو" };

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}