/**
 * Single source of truth for the site's identity.
 *
 * `name` and `role` appear in two places each — the visible header and the
 * page metadata — so they live here rather than being typed twice.
 *
 * `description` is deliberately *not* the About prose. It's the ~155-character
 * summary search engines and link previews show, and the About text is far too
 * long for that. It also can't share a string with the About page, because that
 * prose has <InlineBadge> elements inline mid-sentence. Keep the two in sync by
 * hand: when the About text changes meaningfully, update this line too.
 */
export const SITE = {
  /**
   * Canonical origin. The apex is canonical and `www` redirects to it, so this
   * is the bare domain. If that ever flips, change it here — every absolute URL
   * in the metadata is derived from this value, and pointing it at a hostname
   * that redirects makes crawlers follow a hop to reach the real page.
   */
  url: "https://abushinsky.com",
  name: "Alexander Bushinsky",
  role: "Full-Stack Software Engineer",
  description:
    "Full-Stack Software Engineer building AI-integrated solutions across EV charging, V2G, battery energy storage, grid services, and LLM APIs in production.",
} as const;
