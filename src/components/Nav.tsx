"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The pill nav.
 *
 * This is the one component that has to run in the browser: `usePathname()`
 * is a React hook, and hooks only work in Client Components. That's what the
 * "use client" directive at the top of the file marks. Everything else in
 * this project stays on the server.
 */

const LINKS = [
  { href: "/", label: "About" },
  { href: "/reading", label: "Reading" },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="inline-flex rounded-full bg-neutral-100 p-1">
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full bg-white px-5 py-1.5 text-sm font-medium text-neutral-900 shadow-sm"
                : "rounded-full px-5 py-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
