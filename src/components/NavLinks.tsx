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
      <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative text-ink-muted transition-colors hover:text-ink"
          >
            {link.label}
            <span className="pointer-events-none absolute -bottom-1.5 right-0 h-0.5 w-0 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}

        {role ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors ${roleBadgeClasses}`}
            >
              <UserIcon className="h-4 w-4" />
              {roleLabel(role)}
              <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute inset-e-0 top-full mt-3 w-52 overflow-hidden rounded-2xl border border-line bg-white/90 p-1.5 shadow-[0_24px_64px_-24px_rgba(44,57,71,0.3)] backdrop-blur-xl">
                <span className="block border-b border-line px-3 pb-2.5 pt-2 text-xs font-semibold text-ink-muted">
                  {roleLabel(role)} خوش آمدی
                </span>
                <Link
                  href={dashboardHref(role)}
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-gold/10"
                >
                  <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12l9-9 9 9" />
                    <path d="M5 10v10h14V10" />
                  </svg>
                  داشبورد من
                </Link>
                {role === "CANDIDATE" && (
                  <Link
                    href="/candidate/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-gold/10"
                  >
                    <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M4.5 20c1.6-3.5 4.6-5.5 7.5-5.5s5.9 2 7.5 5.5" />
                    </svg>
                    پروفایل من
                  </Link>
                )}
                {role === "EMPLOYER" && (
                  <Link
                    href="/employer/company"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-gold/10"
                  >
                    <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                      <path d="M9 9h.01M9 13h.01M15 9h.01M15 13h.01" />
                    </svg>
                    پروفایل شرکت
                  </Link>
                )}
                <div className="mt-1 border-t border-line" />
                <button
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-right text-sm text-danger-dark transition-colors hover:bg-danger/10"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="m16 17 5-5-5-5M21 12H9" />
                  </svg>
                  خروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-xl border border-ink/10 bg-white/60 px-4 py-2 text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_24px_-12px_rgba(44,57,71,0.2)] active:translate-y-0"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gold px-5 py-2 text-ink shadow-[0_12px_28px_-12px_rgba(194,165,109,0.6)] transition hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_16px_36px_-12px_rgba(194,165,109,0.7)] active:translate-y-0"
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
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition-colors hover:border-gold/30 hover:bg-gold/5 md:hidden"
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
              className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85%] flex-col gap-4 bg-paper px-6 py-6 text-sm font-medium shadow-2xl transition-transform duration-300 ease-out md:hidden ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
                    <svg
                      className="h-4 w-4 text-gold"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                      <path d="M9 9h2M9 13h2M9 17h2" />
                      <path d="M14 9h2M14 13h2M14 17h2" />
                    </svg>
                  </span>
                  منو
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink-muted transition-colors hover:border-gold/30 hover:bg-gold/5"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-ink/5 bg-white/50 px-4 py-3 text-ink transition-colors hover:border-gold/30 hover:bg-gold/5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {role ? (
                <div className="flex flex-col gap-3">
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${roleBadgeClasses}`}
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    {roleLabel(role)}
                  </span>

                  <Link
                    href={dashboardHref(role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                  >
                    <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12l9-9 9 9" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                    داشبورد من
                  </Link>

                  {role === "CANDIDATE" && (
                    <Link
                      href="/candidate/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                    >
                      <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M4.5 20c1.6-3.5 4.6-5.5 7.5-5.5s5.9 2 7.5 5.5" />
                      </svg>
                      پروفایل من
                    </Link>
                  )}

                  {role === "EMPLOYER" && (
                    <Link
                      href="/employer/company"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                    >
                      <svg className="h-4 w-4 text-slate-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                        <path d="M9 9h.01M9 13h.01M15 9h.01M15 13h.01" />
                      </svg>
                      پروفایل شرکت
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="mt-2 flex items-center gap-2.5 rounded-xl px-2 py-2 text-right font-semibold text-danger-dark transition-colors hover:text-danger"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5M21 12H9" />
                    </svg>
                    خروج
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-ink transition hover:border-gold/30"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-center font-bold text-ink shadow-[0_16px_32px_-16px_rgba(194,165,109,0.6)] transition hover:bg-gold-hover"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
