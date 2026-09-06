import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user.role as "EMPLOYER" | "CANDIDATE" | undefined) ?? null;

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-bold text-ink transition-colors hover:text-slate"
        >
          جابینو
        </Link>

        <NavLinks role={role} />
      </div>
    </nav>
  );
}
