import Picture from "./Picture";
import styles from "./MediaView.module.css";

/**
 * Affiche un média (photo ou vidéo) avec son texte alternatif.
 * variant "thumb" : miniature de la galerie ; variant "full" : vue agrandie de la lightbox.
 */
export default function MediaView({ media, variant = "thumb", priority = false }) {
  const { title, image, video } = media;
  // Chemin de l'image d'aperçu d'une vidéo (générée par npm run media)
  const poster = (file) => `/media/${file.replace(/\.[^.]+$/, "")}-poster.webp`;

  if (video) {
    if (variant === "thumb") {
      // poster pré-généré (npm run media) : aucune vidéo n'est téléchargée avant la lecture
      return (
        <video
          className={styles.thumb}
          src={`/${video}`}
          poster={poster(video)}
          preload="none"
          muted
          playsInline
          tabIndex={-1}
          aria-label={title}
        />
      );
    }

    return (
      <video
        className={styles.fullVideo}
        src={`/${video}`}
        poster={poster(video)}
        preload="none"
        controls
        playsInline
        aria-label={title}
      />
    );
  }

  return (
    <Picture
      file={image}
      alt={title}
      priority={priority}
      widths={variant === "thumb" ? [400, 800] : [800, 1600]}
      sizes={variant === "thumb" ? "(max-width: 900px) 50vw, 350px" : "90vw"}
      className={variant === "thumb" ? styles.thumb : styles.fullImage}
    />
  );
}
