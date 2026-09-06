import Link from "next/link";

import { Timeline, TimelineItem } from "@/components/Timeline";
import type { Article } from "@/lib/articles";
import { formatRelative } from "@/lib/date";

const MAX_ITEMS = 4;

/**
 * The compact "what I've been reading" card shown alongside the About text.
 *
 * Entry titles link out to the article itself; the footer link goes to the
 * full reading list.
 */
export default function ReadingCard({ articles }: { articles: Article[] }) {
  // Nothing worth showing an empty box for — the card just disappears.
  if (articles.length === 0) return null;

  return (
    <aside className="rounded-xl border border-neutral-200 p-5">
      <h2 className="mb-5 text-sm font-semibold text-neutral-900">
        Latest from my reading
      </h2>

      <Timeline>
        {articles.slice(0, MAX_ITEMS).map((article) => (
          <TimelineItem
            key={article.id}
            meta={formatRelative(article.dateSaved)}
            gap="tight"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-sm leading-snug text-neutral-800 underline-offset-4 hover:underline"
            >
              {article.title}
            </a>
          </TimelineItem>
        ))}
      </Timeline>

      <Link
        href="/reading"
        className="mt-5 inline-block text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        View reading &rarr;
      </Link>
    </aside>
  );
}
