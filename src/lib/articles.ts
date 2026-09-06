/**
 * The shape of one saved article, as the UI consumes it.
 *
 * This is deliberately a plain, flat object rather than Notion's own nested
 * response type — the mapping from Notion lives in `notion.ts`, so if the
 * Notion schema ever changes, only that file has to change.
 */
export type Article = {
  id: string;
  title: string;
  url: string;
  /** Publication name, e.g. "IEEE Spectrum". Empty string if unset. */
  source: string;
  /** ISO date string (YYYY-MM-DD), or null if the row has no date. */
  dateSaved: string | null;
  tags: string[];
  /** One line of personal commentary. Empty string if unset. */
  note: string;
};

/**
 * Shown when the Notion environment variables aren't configured yet, so the
 * page renders something real during local development and before the Notion
 * database exists. Delete this once the real database is connected.
 */
export const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "placeholder-1",
    title: "The grid needs storage more than it needs generation",
    url: "https://example.com/grid-storage",
    source: "Example Publication",
    dateSaved: "2026-08-28",
    tags: ["BESS", "Grid"],
    note: "Placeholder entry — replace by connecting the Notion database.",
  },
  {
    id: "placeholder-2",
    title: "What V2G actually requires from a charger",
    url: "https://example.com/v2g-chargers",
    source: "Example Publication",
    dateSaved: "2026-08-14",
    tags: ["EV", "V2G"],
    note: "",
  },
  {
    id: "placeholder-3",
    title: "Designing telemetry pipelines that don't bankrupt you",
    url: "https://example.com/telemetry-cost",
    source: "Example Publication",
    dateSaved: "2026-07-30",
    tags: ["Telemetry", "Cost"],
    note: "Placeholder entry — replace by connecting the Notion database.",
  },
];
