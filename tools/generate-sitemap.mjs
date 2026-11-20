import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://transserve.in";
const skip = new Set([
  "backup-pre-seo",
  "backup-pre-full-ux",
  "screenshots",
  "tools",
  "node_modules",
  "img",
  "css",
  "js",
]);

const urls = [];

function walk(dir, base = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, `${base}/${ent.name}`);
    } else if (ent.name === "index.html") {
      let u = base || "";
      u = u.replace(/\\/g, "/");
      if (!u) u = "/";
      else {
        if (!u.startsWith("/")) u = `/${u}`;
        if (!u.endsWith("/")) u += "/";
      }
      urls.push(u);
    }
  }
}

walk(ROOT);

const uniq = [...new Set(urls)].sort((a, b) => a.localeCompare(b));
const today = new Date().toISOString().slice(0, 10);

function pair(u) {
  if (u.startsWith("/hi")) {
    const en = u === "/hi/" ? "/" : u.replace(/^\/hi/, "") || "/";
    return { en: en.endsWith("/") || en === "/" ? en : en + "/", hi: u };
  }
  return { en: u, hi: u === "/" ? "/hi/" : `/hi${u}` };
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
];

for (const u of uniq) {
  const { en, hi } = pair(u);
  const loc = ORIGIN + (u === "/" ? "/" : u);
  lines.push("  <url>");
  lines.push(`    <loc>${loc}</loc>`);
  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push(
    `    <xhtml:link rel="alternate" hreflang="en-IN" href="${ORIGIN}${en === "/" ? "/" : en}"/>`,
  );
  lines.push(
    `    <xhtml:link rel="alternate" hreflang="hi-IN" href="${ORIGIN}${hi}"/>`,
  );
  lines.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${en === "/" ? "/" : en}"/>`,
  );
  lines.push("  </url>");
}
lines.push("</urlset>");

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), lines.join("\n"));
console.log("sitemap urls:", uniq.length);
uniq.forEach((u) => console.log(u));
