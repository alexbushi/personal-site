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
  /** Empty string if the row has no link; the title then renders unlinked. */
  url: string;
  /** ISO date string (YYYY-MM-DD), or null if the row has no date. */
  dateSaved: string | null;
  tags: string[];
  /** One line of personal commentary. Empty string if unset. */
  note: string;
};
