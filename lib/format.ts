import { productLabels, type Product } from "@/content/chandon";

export function blendText(p: Product): string {
  return p.blend.every((b) => b.pct !== null)
    ? p.blend.map((b) => `${b.pct}% ${b.variety}`).join(", ")
    : productLabels.unspecifiedBlend;
}
