import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavLinks from "./NavLinks";
import { LogoMark } from "./icons";
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
            <LogoMark className="h-5 w-5 text-gold" />
          </span>
          <span>جابینو</span>
        </Link>

        <NavLinks role={role} />
      </div>
    </nav>
  );
}