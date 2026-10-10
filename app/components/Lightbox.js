"use client";

import Modal from "./Modal";
import MediaView from "./MediaView";
import { ChevronIcon, CloseIcon } from "./Icons";
import styles from "./Lightbox.module.css";

/**
 * Lightbox : affiche le média sélectionné dans une modale avec navigation précédent/suivant.
 * medias : liste dans l'ordre d'affichage ; selectedIndex : index courant ou null si fermée.
 */
export default function Lightbox({ medias, selectedIndex, onNavigate, onClose }) {
  const media = selectedIndex === null ? null : medias[selectedIndex];

  // Navigation circulaire : après le dernier média on revient au premier, et inversement
  function showPrevious() {
    onNavigate((selectedIndex - 1 + medias.length) % medias.length);
  }

  function showNext() {
    onNavigate((selectedIndex + 1) % medias.length);
  }

  function handleKeyDown(event) {
    // Sur un lecteur vidéo, les flèches servent à avancer/reculer dans la vidéo
    if (event.target.tagName === "VIDEO") return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  }

  return (
    <Modal
      isOpen={media !== null}
      onClose={onClose}
      label={media ? `${media.title}, vue agrandie` : undefined}
      className={styles.dialog}
      onKeyDown={handleKeyDown}
    >
      {media && (
        <div className={styles.content}>
          <button
            type="button"
            className={`${styles.control} ${styles.previous}`}
            onClick={showPrevious}
            aria-label="Média précédent"
          >
            <ChevronIcon direction="left" size={32} />
          </button>

          <figure className={styles.figure}>
            <div className={styles.media}>
              <MediaView key={media.id} media={media} variant="full" />
            </div>
            <figcaption className={styles.caption}>{media.title}</figcaption>
          </figure>

          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            onClick={showNext}
            aria-label="Média suivant"
          >
            <ChevronIcon direction="right" size={32} />
          </button>

          <button
            type="button"
            className={`${styles.control} ${styles.close}`}
            onClick={onClose}
            aria-label="Fermer la vue agrandie"
          >
            <CloseIcon size={40} />
          </button>
        </div>
      )}
    </Modal>
  );
}
