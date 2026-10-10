import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

// En-tête commun : logo cliquable vers l'accueil + contenu optionnel (ex. titre de page)
export default function Header({ children }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/logo.svg"
          alt="FishEye, retour à la page d'accueil"
          width={200}
          height={50}
          priority
        />
      </Link>
      {children}
    </header>
  );
}
