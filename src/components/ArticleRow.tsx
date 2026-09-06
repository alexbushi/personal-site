import { TimelineItem } from "@/components/Timeline";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/date";

/** One entry in the reading timeline. */
export default function ArticleRow({ article }: { article: Article }) {
  // e.g. "Aug 28, 2026 · IEEE Spectrum" — either half may be missing.
  const meta = [formatDate(article.dateSaved), article.source]
    .filter(Boolean)
    .join(" · ");

  return (
    <TimelineItem meta={meta}>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-0.5 block text-[15px] text-neutral-900 underline-offset-4 hover:underline"
      >
        {article.title}
      </a>

      {article.note && (
        <p className="mt-1.5 text-sm leading-6 text-neutral-600">{article.note}</p>
      )}

      {article.tags.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </TimelineItem>
  );
}
