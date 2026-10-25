import Link from "next/link";
import styles from "./status.module.css";

// Page affichée par notFound() (photographe inconnu) et pour toute URL inexistante
export default function NotFound() {
  return (
    <main id="main" className={styles.status}>
      <h1 className={styles.title}>Page introuvable</h1>
      <p>Ce photographe n&apos;existe pas ou la page a été déplacée.</p>
      <div className={styles.actions}>
        <Link href="/" className="button">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
