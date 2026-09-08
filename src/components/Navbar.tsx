import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavLinks from "./NavLinks";
import { userRoleSchema } from "@/lib/validation";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const parsedRole = userRoleSchema.safeParse(session?.user.role);
  const role = parsedRole.success ? parsedRole.data : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-xl font-bold text-ink transition-colors hover:text-slate"
        >
          {/* لوگو با نشان طلایی */}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink shadow-[0_8px_20px_-8px_rgba(44,57,71,0.4)]">
            <svg
              className="h-5 w-5 text-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 9h2M9 13h2M9 17h2" />
              <path d="M14 9h2M14 13h2M14 17h2" />
            </svg>
          </span>
          <span>جابینو</span>
        </Link>

        <NavLinks role={role} />
      </div>
    </nav>
  );
}