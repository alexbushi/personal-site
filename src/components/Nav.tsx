import Link from "next/link";

/**
 * The pill nav.
 *
 * `current` is passed in by whichever page is rendering, rather than read from
 * `usePathname()`. That hook only works in a Client Component, and under Cache
 * Components the root route's static shell is generated without a concrete URL
 * to resolve against — so the prerendered HTML for "/" came out with neither
 * pill active, and stayed that way until a client navigation gave the router a
 * pathname. Hence the original symptom: About looked unselected until you
 * clicked Reading and came back.
 *
 * Taking the route as a prop makes the active state a server-rendered fact.
 * It is correct in the very first byte of HTML, needs no hydration, and this
 * file no longer ships any JavaScript to the browser.
 */

const LINKS = [
  { href: "/", label: "About" },
  { href: "/reading", label: "Reading" },
] as const;

/** The href of the page rendering this nav. */
export type NavRoute = (typeof LINKS)[number]["href"];

export default function Nav({ current }: { current: NavRoute }) {
  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex rounded-full bg-neutral-100 p-1">
        {LINKS.map(({ href, label }) => {
          const isActive = href === current;

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
    </div>
  );
}
