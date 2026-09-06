/**
 * Date helpers.
 *
 * Both parse "YYYY-MM-DD" by hand rather than with `new Date(iso)`, because a
 * bare date string is parsed as UTC midnight — which renders as the previous
 * day for anyone west of Greenwich.
 */

function parseIsoDate(iso: string | null): Date | null {
  if (!iso) return null;

  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

/** "2026-08-28" → "Aug 28, 2026". Empty string if the date is missing. */
export function formatDate(iso: string | null): string {
  const date = parseIsoDate(iso);
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * "2026-08-28" → "2 days ago".
 *
 * Note on staleness: pages are prerendered, so "now" is frozen at the moment
 * the page was last built or revalidated — not the moment someone reads it.
 * Every page using this must set `revalidate`, which bounds the drift to that
 * interval (currently one day). Absolute dates are used on the full reading
 * list, where precision matters more than the conversational phrasing.
 */
export function formatRelative(iso: string | null, now: Date = new Date()): string {
  const date = parseIsoDate(iso);
  if (!date) return "";

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today.getTime() - date.getTime()) / 86_400_000);

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "last month" : `${months} months ago`;

  const years = Math.floor(days / 365);
  return years === 1 ? "last year" : `${years} years ago`;
}
