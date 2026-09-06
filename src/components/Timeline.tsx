import type { ReactNode } from "react";

/**
 * A vertical timeline: one continuous rule with a dot per entry.
 *
 * How the alignment works: the rule is the `<ol>`'s left border, and `pl-7`
 * (28px) puts the list content 28px to its right. Each dot is 8px wide and
 * positioned at `-left-8` (-32px), so it spans -32px to -24px — centred on
 * the rule. The white ring punches a gap in the rule behind each dot.
 */

export function Timeline({ children }: { children: ReactNode }) {
  return <ol className="relative border-l border-neutral-200 pl-7">{children}</ol>;
}

export function TimelineItem({
  meta,
  children,
  gap = "normal",
}: {
  /** The small grey line above the entry, e.g. "2 days ago". */
  meta: string;
  children: ReactNode;
  /** "tight" for the compact About card, "normal" for the full list. */
  gap?: "tight" | "normal";
}) {
  return (
    <li
      className={
        gap === "tight"
          ? "group relative pb-5 last:pb-0"
          : "group relative pb-8 last:pb-0"
      }
    >
      {/* Dots alternate black, green, black… down the timeline, picking up the
          site mark's pairing. `group-even` reads the parent <li>'s position in
          the list, so no index has to be threaded through from the page. */}
      <span
        aria-hidden="true"
        className="absolute -left-8 top-1.5 h-2 w-2 rounded-full bg-neutral-900 ring-4 ring-white group-even:bg-accent"
      />
      {meta && <p className="text-sm text-neutral-500">{meta}</p>}
      {children}
    </li>
  );
}
