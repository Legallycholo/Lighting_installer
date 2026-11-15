// Original vector stand-ins, not customer photography. Regenerate with pnpm assets.
import { writeFile, mkdir } from "node:fs/promises";
const out = new URL("../public/media/", import.meta.url);
await mkdir(out, { recursive: true });
const save = (name, svg) => writeFile(new URL(name, out), svg);
const dots = (x1, y1, x2, y2, n = 24, lit = true) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return `<circle cx="${x1 + (x2 - x1) * t}" cy="${y1 + (y2 - y1) * t}" r="4" fill="${lit ? "#ffe8a1" : "#6a7464"}" ${lit ? 'filter="url(#glow)"' : ""}/>`;
  }).join("");
const palm = (x, y, s = 1, lit = true) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q16 -90 0 -200" fill="none" stroke="#6c604a" stroke-width="16"/>${[-1, 1].map((sign) => `<path d="M0 -200 Q${sign * 55} -245 ${sign * 90} -185 Q${sign * 35} -208 0 -195 M0 -200 Q${sign * 35} -270 ${sign * 67} -235 Q${sign * 20} -237 0 -200" fill="#466956"/>`).join("")}${Array.from({ length: 14 }, (_, i) => `<path d="M${-7 + i * 0.15} ${-12 - i * 12}l17 -4" stroke="${lit ? "#ffe8a1" : "#657663"}" stroke-width="3" ${lit ? 'filter="url(#glow)"' : ""}/>`).join("")}</g>`;
function scene(seed = 0, lit = true, levels = 1, commercial = false) {
  const roof = 280 - levels * 25;
  const wall = roof + 65;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${seed % 2 ? "#293a43" : "#172e35"}"/><stop offset="1" stop-color="#718675"/></linearGradient><linearGradient id="lawn" x2="0" y2="1"><stop stop-color="#284938"/><stop offset="1" stop-color="#122d29"/></linearGradient><filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="800" height="600" fill="url(#sky)"/><circle cx="${650 - seed * 30}" cy="90" r="24" fill="#f4ecd9" opacity=".85"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 137 + seed * 83) % 800}" cy="${30 + ((i * 43) % 190)}" r="1" fill="#f4ecd9" opacity=".5"/>`).join("")}<path d="M0 400 Q200 340 400 390 T800 360V600H0Z" fill="url(#lawn)"/><path d="M380 410 250 600H610L460 410Z" fill="#797c69"/><path d="M405 410 365 600H495L445 410Z" fill="#96947f" opacity=".5"/><rect x="160" y="${wall}" width="470" height="${420 - wall}" fill="#c6baa0" stroke="#233a34" stroke-width="5"/><path d="M135 ${wall} 280 ${roof - 40} 650 ${wall}Z" fill="#754e40" stroke="#233a34" stroke-width="5"/><path d="M135 ${wall} 280 ${roof - 40} 650 ${wall}" fill="none" stroke="#203c30" stroke-width="9"/>${dots(135, wall, 280, roof - 40, 18, lit)}${dots(280, roof - 40, 650, wall, 40, lit)}<rect x="382" y="${wall + 35}" width="63" height="${420 - wall - 35}" rx="4" fill="#314b43" stroke="#e6d7b4" stroke-width="6"/>${[200, 290, 480, 560].map((x) => `<rect x="${x}" y="${wall + 26}" width="45" height="${commercial ? 70 : 48}" fill="${lit ? "#e3ba64" : "#607b76"}" stroke="#f4ecd9" stroke-width="6"/><path d="M${x + 22} ${wall + 26}v48" stroke="#dacdb4" stroke-width="4"/>`).join("")}${levels > 1 ? `<rect x="295" y="${roof - 5}" width="170" height="53" fill="#c6baa0" stroke="#243b35" stroke-width="4"/><path d="M282 ${roof} 380 ${roof - 80} 478 ${roof}" fill="#754e40" stroke="#243b35" stroke-width="5"/>${dots(282, roof, 380, roof - 80, 12, lit)}${dots(380, roof - 80, 478, roof, 12, lit)}<rect x="350" y="${roof + 8}" width="52" height="34" fill="#e3ba64" stroke="#f4ecd9" stroke-width="4"/>` : ""}${palm(100, 430, 0.95, lit)}${palm(690, 440, 1.2, lit)}${palm(755, 460, 0.75, lit)}<g fill="#355e43"><ellipse cx="230" cy="430" rx="95" ry="26"/><ellipse cx="550" cy="430" rx="76" ry="28"/></g>${dots(148, 428, 312, 428, 20, lit)}${dots(489, 428, 610, 428, 17, lit)}${[0, 1, 2, 3, 4].map((i) => `<path d="M${290 - i * 30} ${465 + i * 29}v16M${510 + i * 20} ${465 + i * 29}v16" stroke="#203c30" stroke-width="4"/><circle cx="${290 - i * 30}" cy="${465 + i * 29}" r="5" fill="#ffe8a1" filter="url(#glow)"/><circle cx="${510 + i * 20}" cy="${465 + i * 29}" r="5" fill="#ffe8a1" filter="url(#glow)"/>`).join("")}<rect x="24" y="553" width="184" height="26" rx="4" fill="#243b35" opacity=".85"/><text x="36" y="570" font-family="sans-serif" font-size="10" letter-spacing="2" fill="#f4ecd9">ILLUSTRATIVE CONCEPT</text></svg>`;
}
await save("hero-reel-poster.svg", scene(0, true, 2));
for (let i = 1; i <= 6; i++)
  await save(`gallery-${i}.svg`, scene(i, true, i % 3 === 0 ? 2 : 1));
for (const [name, height, store] of [
  ["house", 1, false],
  ["store", 1, true],
  ["story1", 1, false],
  ["story2", 2, false],
  ["story3", 3, false],
])
  for (const lit of [false, true])
    await save(
      `quiz-${name}-${lit ? "lit" : "unlit"}.svg`,
      scene(store ? 3 : 1, lit, height, store),
    );
await save("quiz-skyline.svg", scene(5, true, 2));
await save(
  "logo.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><rect x="4" y="4" width="152" height="152" rx="76" fill="#f4ecd9" stroke="#243b35" stroke-width="6"/><circle cx="80" cy="80" r="67" fill="none" stroke="#243b35" stroke-width="2" stroke-dasharray="2 5"/><path d="M35 66Q80 85 125 66" fill="none" stroke="#243b35" stroke-width="2"/><path d="M49 68v10m31-3v12m31-19v10" stroke="#243b35" stroke-width="3"/><ellipse cx="49" cy="82" rx="5" ry="8" fill="#c0362c"/><ellipse cx="80" cy="91" rx="5" ry="8" fill="#e3b34f"/><ellipse cx="111" cy="82" rx="5" ry="8" fill="#c0362c"/><text x="80" y="49" text-anchor="middle" font-family="Georgia,serif" font-size="19" font-weight="bold" fill="#243b35">GLOW &amp;</text><text x="80" y="119" text-anchor="middle" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#243b35">GARLAND</text><text x="80" y="135" text-anchor="middle" font-family="sans-serif" font-size="8" letter-spacing="2" fill="#243b35">LIGHTING CO.</text></svg>`,
);
await save(
  "og.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#c2cfc0"/><rect x="70" y="70" width="1060" height="490" rx="24" fill="#f4ecd9" stroke="#243b35" stroke-width="6"/><text x="600" y="205" text-anchor="middle" fill="#c0362c" font-family="sans-serif" font-size="24" letter-spacing="6">GLOW &amp; GARLAND LIGHTING CO.</text><text x="600" y="310" text-anchor="middle" fill="#243b35" font-family="Georgia,serif" font-weight="bold" font-size="64">A little holiday magic.</text><text x="600" y="390" text-anchor="middle" fill="#243b35" font-family="Georgia,serif" font-size="44">Every detail, taken care of.</text><text x="600" y="485" text-anchor="middle" fill="#243b35" font-family="sans-serif" font-size="20">DESIGN PREVIEW · ILLUSTRATIVE CONTENT</text></svg>`,
);
console.log("Created 20 original SVG placeholder assets.");
