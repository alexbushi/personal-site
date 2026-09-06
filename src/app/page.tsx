import InlineBadge from "@/components/InlineBadge";
import LinkButton from "@/components/LinkButton";
import ReadingCard from "@/components/ReadingCard";
import Section from "@/components/Section";
import { getArticles } from "@/lib/notion";

/**
 * This page now shows recent reading alongside the prose, so it depends on
 * Notion data and needs the same daily refresh as /reading. It also bounds
 * how stale the card's relative dates ("2 days ago") can get — see the note
 * in lib/date.ts.
 */
export const revalidate = 86400;

/**
 * The About page, served at "/" — a file named `page.tsx` directly inside
 * `src/app/` is the site root.
 */
export default async function AboutPage() {
  const articles = await getArticles();

  return (
    <div className="relative mx-auto max-w-2xl">
      <div>
        <Section label="General">
          <p>
            Full-Stack Software Engineer developing AI integrated solutions in
            fast-paced startup environments. I accelerate product lifecycles
            from concept to production, with experience in Electric Vehicle (EV)
            charging infrastructure and controls{" "}
            <InlineBadge icon="bolt" />, Battery Energy Storage Systems (BESS){" "}
            <InlineBadge icon="battery" />, Microgrid controller communication
            interface design, electric grid services, high-throughput telemetry
            data pipelines,
            energy management system controls, and UI development.
          </p>
          <p>
            I write high-quality, observable code that minimizes cloud computing
            expenses and accelerates time-to-resolution for production issues. I
            collaborate with cross-functional teams to translate complex
            requirements into efficient, reliable code.
          </p>
        </Section>

        <Section label="Education">
          <p>
            With degrees in Computer and Electrical Engineering (M.Sc.),
            Cybersecurity (M.Sc.), and MBA, from the University of Delaware,
            where V2G technology was first pioneered and where I contributed to
            research, I provide a multifaceted technical foundation to help shape
            the growing landscape of clean energy technology and grid-integrated
            mobility.
          </p>
        </Section>

        <div className="mt-12">
          <LinkButton href="https://www.linkedin.com/in/abushinsky/">
            Connect on LinkedIn
          </LinkButton>
        </div>
      </div>

      {/* Below `xl` this sits in the normal flow, under the prose. At `xl` it
          lifts out to the right margin — `left-full` puts its left edge at the
          right edge of the centred column, so the text stays centred. */}
      {/* The gap grows with the screen: 32px at 1280, where the card already
          sits against the container's right edge and can't move further, up to
          96px on wide displays. `30vw - 22rem` is the line through those two
          points; the clamp holds it there at both ends. One fluid value rather
          than stepped breakpoints — stepping needs a custom breakpoint between
          `xl` and `2xl`, and Tailwind sorts custom breakpoints ahead of the
          built-in ones, so `xl:` would override it at exactly the widths that
          need the wider gap. */}
      <div className="mt-14 xl:absolute xl:left-full xl:top-0 xl:mt-0 xl:ml-[clamp(2rem,30vw-22rem,6rem)] xl:w-60 2xl:w-72">
        <ReadingCard articles={articles} />
      </div>
    </div>
  );
}
