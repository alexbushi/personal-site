import { Client } from "@notionhq/client";

import { PLACEHOLDER_ARTICLES, type Article } from "./articles";

/**
 * Pin the Notion API version explicitly.
 *
 * The SDK's own built-in default is still "2025-09-03", so without this line
 * we'd silently be talking to an older API than we think. See:
 * https://developers.notion.com/reference/versioning
 */
const NOTION_VERSION = "2026-03-11";

/**
 * These must match the property names in the Notion database exactly —
 * the API returns properties keyed by their human-readable name.
 */
const PROPERTY = {
  title: "Title",
  url: "URL",
  source: "Source",
  dateSaved: "Date Saved",
  tags: "Tags",
  note: "Note",
  published: "Published",
} as const;

/* -------------------------------------------------------------------------- */
/* Property readers                                                           */
/*                                                                            */
/* Notion nests every property differently depending on its type, and any     */
/* field can be missing on a half-filled row. Each reader below takes an      */
/* unknown value and always returns a usable default, so one incomplete row   */
/* renders blank instead of crashing the whole page.                          */
/* -------------------------------------------------------------------------- */

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

/** Reads a `title` or `rich_text` property down to a plain string. */
function readText(property: unknown): string {
  const prop = asRecord(property);
  if (!prop) return "";

  const chunks = prop.title ?? prop.rich_text;
  if (!Array.isArray(chunks)) return "";

  return chunks
    .map((chunk) => {
      const text = asRecord(chunk)?.plain_text;
      return typeof text === "string" ? text : "";
    })
    .join("")
    .trim();
}

function readUrl(property: unknown): string {
  const url = asRecord(property)?.url;
  return typeof url === "string" ? url : "";
}

function readSelect(property: unknown): string {
  const name = asRecord(asRecord(property)?.select)?.name;
  return typeof name === "string" ? name : "";
}

function readMultiSelect(property: unknown): string[] {
  const options = asRecord(property)?.multi_select;
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      const name = asRecord(option)?.name;
      return typeof name === "string" ? name : "";
    })
    .filter((name) => name.length > 0);
}

function readDateStart(property: unknown): string | null {
  const start = asRecord(asRecord(property)?.date)?.start;
  return typeof start === "string" ? start : null;
}

/* -------------------------------------------------------------------------- */

/**
 * Fetches saved articles from Notion, newest first.
 *
 * Falls back to placeholder data when the environment variables are absent,
 * which is what lets the site run before the Notion database exists. On an
 * API failure it returns an empty array so the page shows its empty state
 * rather than a 500.
 */
export async function getArticles(): Promise<Article[]> {
  const auth = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!auth || !dataSourceId) {
    return PLACEHOLDER_ARTICLES;
  }

  try {
    const notion = new Client({ auth, notionVersion: NOTION_VERSION });

    // Note: `dataSources.query`, not the removed `databases.query`. Since API
    // version 2025-09-03 a database can hold several data sources, and queries
    // address the data source directly.
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: PROPERTY.published,
        checkbox: { equals: true },
      },
      sorts: [{ property: PROPERTY.dateSaved, direction: "descending" }],
      page_size: 50,
    });

    return response.results
      .map((row, index): Article => {
        const properties = asRecord(asRecord(row)?.properties) ?? {};
        const id = asRecord(row)?.id;

        return {
          id: typeof id === "string" ? id : `row-${index}`,
          title: readText(properties[PROPERTY.title]),
          url: readUrl(properties[PROPERTY.url]),
          source: readSelect(properties[PROPERTY.source]),
          dateSaved: readDateStart(properties[PROPERTY.dateSaved]),
          tags: readMultiSelect(properties[PROPERTY.tags]),
          note: readText(properties[PROPERTY.note]),
        };
      })
      // A row with no title or no link has nothing to render or point at.
      .filter((article) => article.title !== "" && article.url !== "");
  } catch (error) {
    console.error("[notion] Failed to load articles:", error);
    return [];
  }
}
