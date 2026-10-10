import Image from "next/image";
import styles from "./MediaView.module.css";

/**
 * Affiche un média (photo ou vidéo) avec son texte alternatif.
 * variant "thumb" : miniature de la galerie ; variant "full" : vue agrandie de la lightbox.
 */
export default function MediaView({ media, variant = "thumb", priority = false }) {
  const { title, image, video } = media;

  if (video) {
    if (variant === "thumb") {
      // #t=0.1 : le navigateur affiche une image de la vidéo comme miniature, sans lecture
      return (
        <video
          className={styles.thumb}
          src={`/${video}#t=0.1`}
          preload="metadata"
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
        controls
        playsInline
        aria-label={title}
      />
    );
  }

  return (
    <Image
      src={`/${image}`}
      alt={title}
      fill
      priority={priority}
      sizes={variant === "thumb" ? "(max-width: 900px) 50vw, 350px" : "90vw"}
      className={variant === "thumb" ? styles.thumb : styles.fullImage}
    />
  );
}
