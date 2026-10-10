import Image from "next/image";
import Link from "next/link";
import styles from "./PhotographerCard.module.css";

export default function PhotographerCard({ photographer, priority = false }) {
  const { id, name, city, country, tagline, price, portrait } = photographer;

  return (
    <article className={styles.card}>
      {/* Le lien englobe le portrait et le nom ; l'image est décorative (alt vide) car le nom est déjà dans le lien */}
      <Link href={`/photographers/${id}`} className={styles.link}>
        <Image
          src={`/${portrait}`}
          alt=""
          width={200}
          height={200}
          priority={priority}
          className={styles.portrait}
        />
        <h2 className={styles.name}>{name}</h2>
      </Link>
      <p className={styles.location}>
        {city}, {country}
      </p>
      <p className={styles.tagline}>{tagline}</p>
      <p className={styles.price}>{price}€/jour</p>
    </article>
  );
}
