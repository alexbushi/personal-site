import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

/**
 * The image link previews show — LinkedIn, Slack, iMessage, X.
 *
 * Generated at build time rather than shipped as a static file, so it stays in
 * sync with lib/site.ts automatically. 1200x630 is the size every platform
 * crops from; anything smaller gets upscaled and looks soft.
 *
 * Rendered by Satori, which supports only a subset of CSS — flexbox and
 * absolute positioning, no grid — hence the explicit `display: flex`
 * everywhere and the inline styles instead of Tailwind classes.
 *
 * The Geist files are vendored under assets/fonts rather than read from
 * node_modules, because pnpm stores packages under hashed paths that are not
 * stable to reference. Satori also cannot read woff2, which is the format
 * `next/font` caches — hence the .ttf copies.
 */

const [geistRegular, geistSemiBold] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
]);
export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori renders the space character noticeably wider than a browser does, so
 * text with spaces comes out looking loosely tracked. Laying the words out as
 * flex children with an explicit gap sidesteps the space glyph entirely and
 * matches what the site renders.
 */
function Words({ text, gap, style }: { text: string; gap: number; style: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", gap, ...style }}>
      {text.split(" ").map((word) => (
        <div key={word} style={{ display: "flex" }}>
          {word}
        </div>
      ))}
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#ffffff",
          fontFamily: "Geist",
        }}
      >
        {/* The bolt badge, matching the favicon and the inline badges. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "#171717",
            marginBottom: 48,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="#25c63c">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
        </div>

        <Words
          text={SITE.name}
          gap={13}
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#171717",
            // Matches `tracking-tight` on the site's <h1>.
            letterSpacing: "-0.025em",
          }}
        />
        <Words
          text={SITE.role}
          gap={7}
          style={{ fontSize: 34, color: "#737373", marginTop: 16 }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 26,
            color: "#a3a3a3",
          }}
        >
          {SITE.url.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
