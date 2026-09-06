/**
 * A small black tile with a green glyph, sized to sit inline in a sentence —
 * the way the reference site drops little icons beside the things it names.
 *
 * Sizing is in `em` so a badge scales with whatever text it sits in.
 *
 * The tile is 1.05em against a cap height of roughly 0.72em, and sits at
 * `vertical-align: -0.16em`. That centres it on the capitals rather than the
 * baseline: it dips just below the baseline and its top clears the capitals by
 * about the same amount. Sitting it flush on the baseline instead makes a tile
 * this size read as though it has dropped out of the line.
 *
 * No horizontal margin on purpose. In JSX the line break before the badge
 * already collapses to a single space, so a margin on top of that would push
 * it away from the word it belongs to — and a right margin would leave a
 * visible gap before a following comma.
 *
 * Decorative only: `aria-hidden`, because the sentence around each badge
 * already names the thing the icon depicts.
 */

/**
 * Each icon carries its own size. The bolt is tall and narrow so it fills a
 * small box; the battery is short and wide and carries more detail, so it gets
 * a larger box and heavier strokes to stay legible at ~11px.
 */
const ICONS = {
  bolt: {
    size: "h-[0.74em] w-[0.74em]",
    glyph: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  },
  // Portrait battery: terminal on top, charge level filling from the bottom.
  battery: {
    size: "h-[0.82em] w-[0.82em]",
    glyph: (
      <>
        <rect x="9.8" y="1.6" width="4.4" height="2.6" rx="1.2" />
        <rect
          x="6.4"
          y="5.2"
          width="11.2"
          height="17.2"
          rx="3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <rect x="9.4" y="13.2" width="5.2" height="6.6" rx="1.4" />
      </>
    ),
  },
} as const;

export type BadgeIcon = keyof typeof ICONS;

export default function InlineBadge({ icon }: { icon: BadgeIcon }) {
  const { size, glyph } = ICONS[icon];

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[1.05em] w-[1.05em] items-center justify-center rounded-[0.28em] bg-neutral-900 align-[-0.05em]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${size} text-accent`}>
        {glyph}
      </svg>
    </span>
  );
}
