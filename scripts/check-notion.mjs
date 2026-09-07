/**
 * Checks the Notion connection end to end and explains whatever it finds.
 *
 *   pnpm check:notion
 *
 * Reads .env.local via Node's --env-file flag (see the package.json script).
 * Never prints the token — only whether one is present and what shape it has.
 */

import { Client } from "@notionhq/client";

const NOTION_VERSION = "2026-03-11";
const DATABASE_ID = "abb72548f71c439a817652f5a914070a";

const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => console.log(`  ✗ ${m}`);

const token = process.env.NOTION_TOKEN;
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

console.log("\nNotion connection check\n");

if (!token) {
  bad("NOTION_TOKEN is empty in .env.local");
  console.log(`
    Create an integration at https://www.notion.com/my-integrations,
    copy the secret, and paste it after NOTION_TOKEN= in .env.local.
    Until then the site shows placeholder entries, which is expected.
  `);
  process.exit(1);
}
ok(`NOTION_TOKEN present (${token.length} chars, starts "${token.slice(0, 4)}…")`);

const notion = new Client({ auth: token, notionVersion: NOTION_VERSION });

// 1 — can we see the database at all? This is where a missing connection shows.
let resolvedId;
try {
  const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
  const title = db.title?.map((t) => t.plain_text).join("") ?? "(untitled)";
  ok(`Database reachable: "${title}"`);

  resolvedId = db.data_sources?.[0]?.id;
  if (!resolvedId) {
    bad("Database reports no data sources — unexpected; re-run or check Notion.");
    process.exit(1);
  }
  ok(`Data source id from API: ${resolvedId}`);

  if (!dataSourceId) {
    bad("NOTION_DATA_SOURCE_ID is empty — paste the id above into .env.local");
    process.exit(1);
  }
  if (dataSourceId.replace(/-/g, "") === resolvedId.replace(/-/g, "")) {
    ok("Matches NOTION_DATA_SOURCE_ID in .env.local");
  } else {
    bad(`Mismatch! .env.local has ${dataSourceId}`);
    console.log("    Replace it with the id above.");
    process.exit(1);
  }
} catch (error) {
  const status = error?.status ?? error?.code;
  bad(`Could not read the database (${status ?? "unknown error"})`);
  if (status === 401) {
    console.log("    401 means the token itself is wrong. Re-copy the secret.");
  } else if (status === 404 || status === "object_not_found") {
    console.log(`
    404 almost always means the integration is not connected to the database.
    The token alone grants nothing. Open the database in Notion:
      ···  →  Connections  →  add your integration
    Then run this again.`);
  } else {
    console.log(`    ${error?.message ?? error}`);
  }
  process.exit(1);
}

// 2 — the query the site actually runs.
try {
  const res = await notion.dataSources.query({
    data_source_id: resolvedId,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date Saved", direction: "descending" }],
    page_size: 50,
  });

  ok(`Query succeeded — ${res.results.length} published row(s)`);

  if (res.results.length === 0) {
    console.log(`
    The connection works. The list is empty because no row has Published
    checked yet. Add a row in Notion and tick Published.`);
  } else {
    console.log("\n  What the site will render:\n");
    for (const row of res.results) {
      const p = row.properties ?? {};
      const title = p.Title?.title?.map((t) => t.plain_text).join("") || "(no title)";
      const date = p["Date Saved"]?.date?.start ?? "(no date)";
      const tags = (p.Tags?.multi_select ?? []).map((t) => t.name).join(", ");
      const url = p.URL?.url;
      console.log(`    • ${title}`);
      console.log(`      ${date}${tags ? `  [${tags}]` : ""}`);
      if (!url) console.log("      ⚠ no URL — renders as plain text, not a link");
    }
  }
} catch (error) {
  bad(`Query failed: ${error?.message ?? error}`);
  console.log(`
    If this mentions a property name, check that the database still has
    "Published" (checkbox) and "Date Saved" (date) spelled exactly that way —
    the code looks properties up by name.`);
  process.exit(1);
}

console.log("\nAll good.\n");
