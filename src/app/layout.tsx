import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
  /**
   * `metadataBase` is the origin Next.js resolves relative metadata URLs
   * against. Without it, the generated Open Graph image URL stays relative,
   * and crawlers like LinkedIn's cannot fetch it — the preview falls back to
   * a bare link.
   */
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  // Tells search engines which hostname to index, so the apex and www aren't
  // treated as two competing copies of the same site.
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: SITE.name,
    // Same template as the page title, so /reading gets "Reading · <name>"
    // in its Open Graph tags rather than inheriting the site-wide title.
    title: { default: SITE.name, template: `%s · ${SITE.name}` },
    description: SITE.description,
    url: SITE.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: { default: SITE.name, template: `%s · ${SITE.name}` },
    description: SITE.description,
  },
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

          {/* Each page renders its own <Nav current=… />, because a layout has
              no way to know which route is active. */}
          <main>{children}</main>
        </div>

        {/* Vercel Web Analytics. Renders no UI — it injects a small script
            that records page views. Cookieless, and it collects no personal
            data, so it needs no consent banner. Only reports from the
            deployed site; it is inert on localhost. */}
        <Analytics />
      </body>
    </html>
  );
}
