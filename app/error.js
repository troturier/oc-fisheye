"use client";

import Link from "next/link";
import styles from "./status.module.css";

// Page affichée si la lecture des données échoue
export default function Error({ reset }) {
  return (
    <main id="main" className={styles.status}>
      <h1 className={styles.title}>Une erreur est survenue</h1>
      <p>Le contenu n&apos;a pas pu être chargé. Veuillez réessayer.</p>
      <div className={styles.actions}>
        <button type="button" className="button" onClick={() => reset()}>
          Réessayer
        </button>
        <Link href="/" className="button">
          Accueil
        </Link>
      </div>
    </main>
  );
}
