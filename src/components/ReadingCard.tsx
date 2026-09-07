import Link from "next/link";
import { cacheLife } from "next/cache";

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
export default async function ReadingCard({ articles }: { articles: Article[] }) {
  // `formatRelative` below reads the clock, which Cache Components treats as an
  // unstable value during prerendering. Caching this component pins "now" to
  // the moment the cache entry was made, so every viewer sees the same
  // "9 days ago" until it revalidates alongside the data.
  "use cache";
  cacheLife("days");

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
            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-sm leading-snug text-neutral-800 underline-offset-4 hover:underline"
              >
                {article.title}
              </a>
            ) : (
              <p className="mt-0.5 text-sm leading-snug text-neutral-800">
                {article.title}
              </p>
            )}
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
