import Image from "next/image";
import { dims, media } from "@/lib/media";

type PhotoProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/** Foto a sangre dentro de un contenedor con position relative. */
export function Photo({ src, alt, sizes = "100vw", priority, className = "", style }: PhotoProps) {
  return (
    <Image
      src={media(src)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={style}
    />
  );
}

/** Botella recortada (PNG/WebP transparente). Mantiene la proporcion real. */
export function Bottle({
  src,
  alt,
  sizes = "(min-width: 768px) 28vw, 60vw",
  className = "",
  priority,
  style,
}: Omit<PhotoProps, "style"> & { style?: React.CSSProperties }) {
  const s = media(src);
  const d = dims(s);
  return (
    <Image
      src={s}
      alt={alt}
      width={d.width}
      height={d.height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      draggable={false}
    />
  );
}
