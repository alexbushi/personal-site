import type { Metadata } from "next";

import ArticleRow from "@/components/ArticleRow";
import Section from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { getArticles } from "@/lib/notion";

/**
 * The daily pull, in one line.
 *
 * Next.js renders this page to static HTML and serves that same HTML to every
 * visitor instantly, re-running `getArticles()` at most once per 86400 seconds
 * (24 hours). No cron job, no scheduler, no cache service. The first visitor
 * after the 24-hour mark gets the slightly stale page and triggers a refresh
 * in the background; everyone after that gets fresh data.
 *
 * The value has to be a literal number — Next.js reads it statically, so
 * `60 * 60 * 24` would not work here.
 */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Reading",
  description: "Articles I have been saving.",
};

/**
 * An async Server Component. Because this runs on the server rather than in
 * the browser, it can `await` the Notion call directly — no useEffect, no
 * loading state — and the Notion token never reaches the client, since this
 * component's code is never sent there. Only the finished HTML is.
 */
export default async function ReadingPage() {
  const articles = await getArticles();

  return (
    // The intro paragraph fills this column, which is what makes the block read
    // as centred. Without it the short timeline entries left a wide empty
    // gutter and the list looked left-aligned even though the box was centred.
    <div className="mx-auto w-full max-w-xl">
      <Section label="What I'm Reading">
        <p>
          AI is changing software engineering fast, and most of the writing
          about it is noise. These are the most useful articles and videos
          I&apos;ve found &mdash; no hype, just the material I&apos;ve actually
          used to integrate AI into my own work.
        </p>

        {articles.length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing here yet.</p>
        ) : (
          <div className="pt-4">
            <Timeline>
              {articles.map((article) => (
                <ArticleRow key={article.id} article={article} />
              ))}
            </Timeline>
          </div>
        )}
      </Section>
    </div>
  );
}
