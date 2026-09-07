import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Nav from "@/components/Nav";
import { SITE } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * `metadata` sets the browser tab title and the description search engines
 * show. `template` means a page exporting `title: "Reading"` renders as
 * "Reading · <name>". All three values come from lib/site.ts, which is also
 * what the visible header below renders.
 */
export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
};

/**
 * The root layout renders once and wraps every page. The header and nav live
 * here so they're written once rather than repeated on each page; `children`
 * is whichever page the visitor is currently on.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="bg-white text-neutral-900">
        {/* The column stays narrow and centred at every size. It only widens
            at `xl`, where there's enough room either side of the centred text
            for the reading card to sit in the right margin. */}
        <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20 xl:max-w-[90rem] 2xl:max-w-[96rem]">
          <header className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {SITE.name}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">{SITE.role}</p>
          </header>

          <div className="mt-8 flex justify-center">
            <Nav />
          </div>

          <main className="mt-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
