const ONE_YEAR = "public, max-age=31536000, immutable";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      // variantes générées par `npm run media` : nom stable, contenu régénéré seulement si l'original change
      { source: "/media/:file*", headers: [{ key: "Cache-Control", value: ONE_YEAR }] },
      // médias d'origine (vidéos, JPG) : cache d'une semaine au lieu de max-age=0
      {
        source: "/:file*.(mp4|jpg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
