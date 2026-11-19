import manifest from "@/public/media/manifest.json";

type Entry = { width: number; height: number; dominant: string };
const data = manifest as Record<string, Entry>;

export const FALLBACK = "/media/site/home-hero-1.webp";

/** Devuelve la ruta solo si el archivo fue descargado; si no, la imagen de respaldo. */
export function media(src: string, fallback: string = FALLBACK): string {
  return src in data ? src : fallback;
}

export function dims(src: string): Entry {
  return data[media(src)] ?? { width: 1200, height: 800, dominant: "#111111" };
}
