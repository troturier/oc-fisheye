import MediaView from "./MediaView";
import { HeartIcon } from "./Icons";
import styles from "./MediaCard.module.css";

// Carte d'un média : miniature cliquable (ouvre la lightbox) + titre + bouton like
export default function MediaCard({ media, priority = false, onOpen, onLike }) {
  const { id, title, likes } = media;

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.thumbButton}
        onClick={() => onOpen(id)}
        aria-label={`${title}, vue agrandie`}
      >
        <MediaView media={media} variant="thumb" priority={priority} />
      </button>
      <div className={styles.footer}>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.like}
          onClick={() => onLike(id)}
          aria-label={`J'aime « ${title} », ${likes} j'aime actuellement`}
        >
          <span aria-hidden="true">{likes}</span>
          <HeartIcon size={22} />
        </button>
      </div>
    </article>
  );
}
