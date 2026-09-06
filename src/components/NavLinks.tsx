"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const emptySubscribe = () => () => {};

// روش رسمی ری‌اکت برای تشخیص «آیا کامپوننت روی کلاینت هیدرات شده»
// بدون setState داخل useEffect و بدون خطای hydration mismatch
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type Role = "EMPLOYER" | "CANDIDATE" | null;

function buildLinks(role: Role) {
  const links: { href: string; label: string }[] = [
    { href: "/jobs", label: "آگهی‌ها" },
  ];

  if (role === "EMPLOYER") {
    links.push({ href: "/employer/new", label: "ثبت آگهی" });
  }

  return links;
}

function dashboardHref(role: Role) {
  return role === "EMPLOYER" ? "/employer" : "/candidate";
}

function roleLabel(role: Role) {
  return role === "EMPLOYER" ? "کارفرما" : "کارجو";
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.6-3.5 4.6-5.5 7.5-5.5s5.9 2 7.5 5.5" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function NavLinks({ role }: { role: Role }) {
  const [open, setOpen] = useState(false); // پنل موبایل
  const [menuOpen, setMenuOpen] = useState(false); // دراپ‌داون کاربر (دسکتاپ)
  const mounted = useMounted();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const links = buildLinks(role);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSignOut() {
    await authClient.signOut();
    setOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const roleBadgeClasses =
    role === "EMPLOYER"
      ? "border-gold/40 bg-gold/10 text-ink hover:bg-gold/20"
      : "border-slate/30 bg-slate/10 text-slate-dark hover:bg-slate/20";

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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${roleBadgeClasses}`}
            >
              <UserIcon className="h-4 w-4" />
              {roleLabel(role)}
              <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute end-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-line bg-paper shadow-lg">
                <Link
                  href={dashboardHref(role)}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-slate/10"
                >
                  داشبورد من
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2.5 text-right text-sm text-danger-dark transition-colors hover:bg-danger/10"
                >
                  خروج
                </button>
              </div>
            )}
          </div>
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

      {mounted &&
        createPortal(
          <>
            {/* پس‌زمینه‌ی تیره پشت دراور */}
            <div
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 md:hidden ${
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            {/* دراور موبایل - از راست به چپ باز می‌شود */}
            <div
              className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80%] flex-col gap-4 bg-paper px-6 py-6 text-sm font-medium shadow-2xl transition-transform duration-300 ease-out md:hidden ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-ink">منو</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-slate/10"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

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
                <>
                  <div className="my-1 border-t border-line" />

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${roleBadgeClasses}`}
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    {roleLabel(role)}
                  </span>

                  <Link
                    href={dashboardHref(role)}
                    onClick={() => setOpen(false)}
                    className="text-ink-muted transition-colors hover:text-ink"
                  >
                    داشبورد من
                  </Link>

                  <button onClick={handleSignOut} className="text-right text-danger-dark">
                    خروج
                  </button>
                </>
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
          </>,
          document.body
        )}
    </>
  );
}
