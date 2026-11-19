import { brand } from "@/content/chandon";

/** Estrella de siete puntas de Chandon (marca de la capsula). Geometria propia, a color de texto. */
export function Star({ className = "", size = 24 }: { className?: string; size?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 14; i++) {
    const r = i % 2 === 0 ? 50 : 21;
    const a = (Math.PI * 2 * i) / 14 - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={pts.join(" ")} fill="currentColor" />
    </svg>
  );
}

/** Wordmark oficial (SVG extraido del header de chandon.com) como mascara, toma el color del texto. */
export function Logo({ className = "", height = 22 }: { className?: string; height?: number }) {
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={`inline-block bg-current ${className}`}
      style={{
        height,
        width: (height * 193) / 28,
        maskImage: `url(${brand.logo})`,
        WebkitMaskImage: `url(${brand.logo})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

/** Separador de marca: linea vertical del logo + estrella. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="block h-16 w-px bg-current opacity-60" />
      <Star size={14} />
    </div>
  );
}
