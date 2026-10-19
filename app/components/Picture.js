/**
 * Image JPG pré-générée par `npm run media` (public/media/<nom>-<largeur>.avif|webp).
 * Sert AVIF puis WebP selon le navigateur ; `widths` liste les largeurs générées à proposer.
 */
export default function Picture({ file, widths, sizes, alt, priority = false, ...imgProps }) {
  const name = file.replace(/\.[^.]+$/, "");
  const srcSet = (format) => widths.map((w) => `/media/${name}-${w}.${format} ${w}w`).join(", ");
  const fallbackWidth = widths[widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/media/${name}-${fallbackWidth}.webp`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        {...imgProps}
      />
    </picture>
  );
}
