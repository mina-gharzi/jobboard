"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Role = "EMPLOYER" | "CANDIDATE" | null;

function buildLinks(role: Role) {
  const links: { href: string; label: string }[] = [
    { href: "/jobs", label: "آگهی‌ها" },
  ];

  if (role === "EMPLOYER") {
    links.push({ href: "/employer", label: "داشبورد من" });
    links.push({ href: "/employer/new", label: "ثبت آگهی" });
  }

  if (role === "CANDIDATE") {
    links.push({ href: "/candidate", label: "درخواست‌های من" });
  }

  return links;
}

export default function NavLinks({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const links = buildLinks(role);

  async function handleSignOut() {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* دسکتاپ */}
      <div className="hidden items-center gap-6 text-sm font-medium md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-ink-muted transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}

        {role ? (
          <button
            onClick={handleSignOut}
            className="text-ink-muted transition-colors hover:text-danger-dark"
          >
            خروج
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gold px-4 py-2 font-medium text-ink transition-colors hover:bg-gold-hover"
            >
              ثبت‌نام
            </Link>
          </>
        )}
      </div>

      {/* دکمه همبرگر - موبایل */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-slate/10 md:hidden"
      >
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {/* پنل موبایل */}
      {open && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-4 border-b border-line bg-paper/95 px-6 py-5 text-sm font-medium backdrop-blur-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          {role ? (
            <button
              onClick={handleSignOut}
              className="text-right text-danger"
            >
              خروج
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-ink-muted transition-colors hover:text-ink"
              >
                ورود
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gold px-4 py-2 text-center font-medium text-ink transition-colors hover:bg-gold-hover"
              >
                ثبت‌نام
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
