import fs from "fs";
const s = fs.readFileSync("img/Clean Transserve Brand Logo.svg", "utf8");
const nums = [...s.matchAll(/[-+]?\d*\.?\d+/g)].map((m) => Number(m[0])).filter((n) => Number.isFinite(n));
// Too noisy. Parse path M/L/C coordinates instead.
const coords = [];
const pathChunks = s.match(/[MLC]\s*[^MLCZ]+/gi) || [];
for (const chunk of pathChunks) {
  const vals = chunk.slice(1).match(/[-+]?\d*\.?\d+/g) || [];
  for (let i = 0; i + 1 < vals.length; i += 2) {
    const x = Number(vals[i]);
    const y = Number(vals[i + 1]);
    if (x >= 0 && x <= 2170 && y >= 0 && y <= 725) coords.push([x, y]);
  }
}
// Ignore the outer frame rectangle points near exact corners
const inner = coords.filter(
  ([x, y]) => x > 40 && x < 2130 && y > 80 && y < 700,
);
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const [x, y] of inner) {
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
}
console.log({ minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY, samples: inner.length });
