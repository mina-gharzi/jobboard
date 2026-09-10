"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogoMark } from "./icons";
import { Building2, ChevronDown, Home, LogOut, Menu, UserRound, X } from "lucide-react";

const emptySubscribe = () => () => {};

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

export default function NavLinks({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();
  const menuRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef<HTMLElement | null>(null);
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

  // فوکوس: هنگام باز شدن، اولین عنصر تعاملی دراور فوکوس می‌شود و هنگام
  // بستن، فوکوس به دکمه‌ی همبرگر برمی‌گردد.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = document.activeElement as HTMLElement | null;
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current.focus();
      wasOpenRef.current = null;
    }
  }, [open]);

  // focus trap: Tab/Shift+Tab داخل دراور می‌ماند و Escape آن را می‌بندد.
  useEffect(() => {
    if (!open) return;
    const focusableSelector =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panelEl = drawerRef.current;
      if (!panelEl) return;

      const focusables = panelEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelEl.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
              <UserRound className="h-4 w-4" />
              {roleLabel(role)}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
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
                  <Home className="h-4 w-4 text-slate-dark" />
                  داشبورد من
                </Link>
                {role === "CANDIDATE" && (
                  <Link
                    href="/candidate/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-gold/10"
                  >
                    <UserRound className="h-4 w-4 text-slate-dark" />
                    پروفایل من
                  </Link>
                )}
                {role === "EMPLOYER" && (
                  <Link
                    href="/employer/company"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-gold/10"
                  >
                    <Building2 className="h-4 w-4 text-slate-dark" />
                    پروفایل شرکت
                  </Link>
                )}
                <div className="mt-1 border-t border-line" />
                <button
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-right text-sm text-danger-dark transition-colors hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" />
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
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition-colors hover:border-gold/30 hover:bg-gold/5 md:hidden"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {mounted &&
        createPortal(
          <>
            {/* پس‌زمینه‌ی تیره پشت دراور */}
            <div
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 md:hidden ${
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            {/* دراور موبایل - از راست به چپ باز می‌شود */}
            <div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="منوی اصلی"
              id="mobile-menu"
              tabIndex={-1}
              inert={!open}
              className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85%] flex-col gap-4 bg-paper px-6 py-6 text-sm font-medium shadow-2xl transition-transform duration-300 ease-out md:hidden ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
                    <LogoMark className="h-4 w-4 text-gold" />
                  </span>
                  منو
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink-muted transition-colors hover:border-gold/30 hover:bg-gold/5"
                >
                  <X className="h-5 w-5" />
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
                    <UserRound className="h-3.5 w-3.5" />
                    {roleLabel(role)}
                  </span>

                  <Link
                    href={dashboardHref(role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                  >
                    <Home className="h-4 w-4 text-slate-dark" />
                    داشبورد من
                  </Link>

                  {role === "CANDIDATE" && (
                    <Link
                      href="/candidate/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                    >
                      <UserRound className="h-4 w-4 text-slate-dark" />
                      پروفایل من
                    </Link>
                  )}

                  {role === "EMPLOYER" && (
                    <Link
                      href="/employer/company"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-ink transition-colors hover:text-gold"
                    >
                      <Building2 className="h-4 w-4 text-slate-dark" />
                      پروفایل شرکت
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="mt-2 flex items-center gap-2.5 rounded-xl px-2 py-2 text-right font-semibold text-danger-dark transition-colors hover:text-danger"
                  >
                    <LogOut className="h-4 w-4" />
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
