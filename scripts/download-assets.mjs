// Descarga assets de chandon.com. Intenta el original sin recorte y cae a la URL con estilo.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const { base, items } = JSON.parse(await fs.readFile(path.join(root, "content/assets.json"), "utf8"));
const manifest = {};
const missing = [];

async function get(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return null;
    return Buffer.from(await r.arrayBuffer());
  } catch {
    return null;
  }
}

// Quita fondo claro conectado al borde (flood fill) -> alfa.
async function cutout(buf) {
  const img = sharp(buf).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  // ¿ya tiene transparencia real?
  let transparent = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) transparent++;
  if (transparent > w * h * 0.05) return { buf, cut: false };
  const seen = new Uint8Array(w * h);
  const stack = [];
  const isBg = (p) => {
    const o = p * 4;
    return data[o] > 232 && data[o + 1] > 232 && data[o + 2] > 232;
  };
  for (let x = 0; x < w; x++) { stack.push(x, (h - 1) * w + x); }
  for (let y = 0; y < h; y++) { stack.push(y * w, y * w + w - 1); }
  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !isBg(p)) continue;
    seen[p] = 1;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }
  for (let p = 0; p < w * h; p++) if (seen[p]) data[p * 4 + 3] = 0;
  const out = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim()
    .png()
    .toBuffer();
  return { buf: out, cut: true };
}

// Quita el reflejo claro bajo botellas de vidrio oscuro: sube desde abajo hasta la primera fila oscura.
async function dropReflection(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const rowLuma = (y) => {
    let n = 0, l = 0;
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (data[o + 3] > 128) { n++; l += (data[o] + data[o + 1] + data[o + 2]) / 3; }
    }
    return n > w * 0.2 ? l / n : -1;
  };
  let y = h - 1;
  while (y > 0 && rowLuma(y) === -1) y--;
  const bottom = rowLuma(y);
  if (bottom < 140) return buf; // sin reflejo claro (vidrio oscuro hasta el final o vidrio rosado)
  while (y > h * 0.7 && (rowLuma(y) === -1 || rowLuma(y) >= 100)) y--;
  return sharp(buf).extract({ left: 0, top: 0, width: w, height: Math.min(h, y + 6) }).png().toBuffer();
}

for (const [folder, key, rel] of items) {
  const [pathPart] = rel.split("?");
  const name = pathPart.split("/media/image/")[1];
  const original = `https://www.chandon.com/sites/default/files/media/image/${name}`;
  let buf = await get(original);
  let src = "original";
  if (!buf) { buf = await get(base + rel); src = "styled"; }
  if (!buf) { missing.push(`${folder}/${key}`); console.log("FALTA", folder, key); continue; }

  const outDir = path.join(root, "public/media", folder);
  await fs.mkdir(outDir, { recursive: true });
  let pipeline = buf;
  let cut = false;
  const isBottle = folder === "bottle";
  if (isBottle) {
    ({ buf: pipeline, cut } = await cutout(buf));
    // recorta el margen transparente para que todas las botellas midan igual de alto
    pipeline = await sharp(pipeline).trim({ threshold: 8 }).png().toBuffer();
    if (key !== "delice-rose") pipeline = await dropReflection(pipeline);
  }
  const maxW = isBottle ? 1400 : folder === "process" ? 600 : 2400;
  const file = isBottle ? `bottle-${key}.webp` : `${key}.webp`;
  const out = sharp(pipeline).resize({ width: maxW, withoutEnlargement: true }).webp({ quality: isBottle ? 90 : 78, alphaQuality: 95 });
  const info = await out.toFile(path.join(outDir, file));
  const stats = await sharp(pipeline).resize(1, 1).raw().toBuffer();
  const dominant = `#${[...stats.subarray(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  manifest[`/media/${folder}/${file}`] = { width: info.width, height: info.height, dominant, src, cut };
  console.log("OK", folder, key, src, `${info.width}x${info.height}`, cut ? "(recortada)" : "");
}

await fs.writeFile(path.join(root, "public/media/manifest.json"), JSON.stringify(manifest, null, 2));
if (missing.length) console.log("\nNO DESCARGADOS:", missing.join(", "));
