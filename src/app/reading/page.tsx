import type { Metadata } from "next";

import ArticleRow from "@/components/ArticleRow";
import Section from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { getArticles } from "@/lib/notion";

const TITLE = "Reading";
const DESCRIPTION = "Articles and videos I have been saving.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reading" },
  // Next.js does not copy a page's `title` into its Open Graph tags, so a page
  // that wants its own link preview has to say so explicitly.
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/reading" },
  twitter: { title: TITLE, description: DESCRIPTION },
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
          AI is changing software engineering fast. These are the most useful articles and videos
          I&apos;ve found. No hype, just the material I&apos;ve actually
          used to integrate AI into my own work. Plus some other useful career adjacent items.
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
