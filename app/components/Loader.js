import styles from "./Loader.module.css";

// Indicateur de chargement annoncé aux lecteurs d'écran via role="status"
export default function Loader({ label = "Chargement en cours" }) {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
