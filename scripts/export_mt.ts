// deno run --allow-read --allow-write scripts/export_mt.ts
// Combine all Markdown files under posts/entry into a single Movable Type import file

const POSTS_DIR = "posts/entry";
const OUTPUT_FILE = "out/movable_type_export.txt";

type FrontMatter = {
  title?: string;
  publish_date?: string; // YYYY-MM-DD
  abstract?: string;
  [k: string]: unknown;
};

async function* walkMarkdown(dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      yield `${dir}/${entry.name}`;
    }
  }
}

function parseFrontMatterAndBody(text: string): { fm: FrontMatter; body: string } {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { fm: {}, body: text };
  }
  let i = 1;
  const fm: FrontMatter = {};
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "---") { i++; break; }
    // simple key: value parser (no nested structures expected here)
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2]?.trim();
      if (val === "") val = "";
      fm[key as keyof FrontMatter] = val;
    }
  }
  const body = lines.slice(i).join("\n");
  return { fm, body };
}

function toMtDate(isoDate?: string): string | undefined {
  if (!isoDate) return undefined;
  // Accept YYYY-M-D or YYYY-MM-DD
  const m = isoDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return undefined;
  const y = m[1];
  const mm = m[2].padStart(2, "0");
  const dd = m[3].padStart(2, "0");
  return `${mm}/${dd}/${y} 00:00:00`;
}

function buildMtRecord(params: {
  title: string;
  author: string;
  date?: string;
  body: string;
  excerpt?: string;
}): string {
  const parts: string[] = [];
  parts.push(`TITLE: ${params.title}`);
  parts.push(`AUTHOR: ${params.author}`);
  if (params.date) parts.push(`DATE: ${params.date}`);
  parts.push(`STATUS: Publish`);
  parts.push(`CONVERT BREAKS: markdown`);
  parts.push(`TAGS:`);
  parts.push(`-----`);
  parts.push(`BODY:`);
  parts.push(params.body.replaceAll("\r\n", "\n"));
  parts.push(`-----`);
  parts.push(`EXTENDED BODY:`);
  parts.push("");
  parts.push(`-----`);
  parts.push(`EXCERPT:`);
  parts.push(params.excerpt ?? "");
  parts.push(`-----`);
  parts.push(`KEYWORDS:`);
  parts.push("");
  parts.push(`--------`);
  return parts.join("\n");
}

async function main() {
  const records: { dateKey: string; content: string }[] = [];
  for await (const file of walkMarkdown(POSTS_DIR)) {
    const text = await Deno.readTextFile(file);
    const { fm, body } = parseFrontMatterAndBody(text);
    const title = (fm.title as string) ?? "";
    const dateMt = toMtDate(fm.publish_date as string | undefined);
    const excerpt = (fm.abstract as string) ?? "";
    const author = "r4wxii"; // from main.tsx config
    const record = buildMtRecord({ title, author, date: dateMt, body, excerpt });
    const dateKey = (fm.publish_date as string) ?? "0000-00-00";
    records.push({ dateKey, content: record });
  }
  // Sort by date ascending, fallback by content
  records.sort((a, b) => a.dateKey.localeCompare(b.dateKey) || a.content.localeCompare(b.content));
  const output = records.map(r => r.content).join("\n");
  // Ensure output directory exists
  const outDir = OUTPUT_FILE.substring(0, OUTPUT_FILE.lastIndexOf("/"));
  if (outDir) {
    await Deno.mkdir(outDir, { recursive: true }).catch(() => {});
  }
  await Deno.writeTextFile(OUTPUT_FILE, output);
  console.log(`Generated ${OUTPUT_FILE} with ${records.length} entries.`);
}

if (import.meta.main) {
  await main();
}
