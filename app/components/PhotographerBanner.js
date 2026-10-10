import Image from "next/image";
import ContactModal from "./ContactModal";
import styles from "./PhotographerBanner.module.css";

// Bandeau de présentation du photographe (Server Component) ; seule la modale de contact est interactive
export default function PhotographerBanner({ photographer }) {
  const { name, city, country, tagline, portrait } = photographer;

  return (
    <section className={styles.banner} aria-labelledby="photographer-name">
      <div className={styles.identity}>
        <h1 id="photographer-name" className={styles.name}>
          {name}
        </h1>
        <p className={styles.location}>
          {city}, {country}
        </p>
        <p className={styles.tagline}>{tagline}</p>
      </div>
      <div className={styles.contact}>
        <ContactModal photographerName={name} />
      </div>
      <Image
        src={`/${portrait}`}
        alt={name}
        width={200}
        height={200}
        priority
        className={styles.portrait}
      />
    </section>
  );
}
