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
 */
export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

        <div style={{ display: "flex", fontSize: 72, fontWeight: 600, color: "#171717" }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#737373", marginTop: 16 }}>
          {SITE.role}
        </div>

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
    size,
  );
}
