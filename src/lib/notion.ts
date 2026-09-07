import { Client } from "@notionhq/client";
import { cacheLife, cacheTag } from "next/cache";

import { type Article } from "./articles";

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
 * Returns an empty list rather than throwing in the two cases that would
 * otherwise break the page: missing environment variables, and an API failure.
 * Either way the page renders its empty state instead of a 500, and the reason
 * is logged to the server console.
 */
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("days");
  cacheTag("articles");

  const auth = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!auth || !dataSourceId) {
    console.warn(
      "[notion] NOTION_TOKEN or NOTION_DATA_SOURCE_ID missing — reading list will be empty.",
    );
    return [];
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
          dateSaved: readDateStart(properties[PROPERTY.dateSaved]),
          tags: readMultiSelect(properties[PROPERTY.tags]),
          note: readText(properties[PROPERTY.note]),
        };
      })
      // A row with no title has nothing to render. A row with no URL still
      // does — it renders as plain, unclickable text.
      .filter((article) => article.title !== "");
  } catch (error) {
    console.error("[notion] Failed to load articles:", error);
    return [];
  }
}
