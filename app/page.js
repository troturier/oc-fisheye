import { Suspense } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import PhotographerList from "./components/PhotographerList";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <Header>
        <h1 className={styles.title}>Nos photographes</h1>
      </Header>
      <main id="main" className={styles.main}>
        {/* Le Suspense affiche le loader pendant la lecture en base */}
        <Suspense fallback={<Loader label="Chargement des photographes" />}>
          <PhotographerList />
        </Suspense>
      </main>
    </>
  );
}
