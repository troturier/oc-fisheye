import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import MediaGallery from "../../components/MediaGallery";
import PhotographerBanner from "../../components/PhotographerBanner";
import { getAllMediasForPhotographer, getPhotographer } from "../../lib/prisma-db";
import styles from "./page.module.css";

// Titre d'onglet propre à chaque photographe (utile aux lecteurs d'écran et à l'historique)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const photographer = Number.isInteger(Number(id)) ? await getPhotographer(Number(id)) : null;

  return { title: photographer ? photographer.name : "Photographe introuvable" };
}

export default function PhotographerPage({ params }) {
  return (
    <>
      <Header />
      <main id="main" className={styles.main}>
        {/* Le Suspense affiche le loader pendant la lecture en base */}
        <Suspense fallback={<Loader label="Chargement du photographe" />}>
          <PhotographerContent params={params} />
        </Suspense>
      </main>
    </>
  );
}

// Lit l'identifiant dans l'URL puis charge le photographe et ses médias depuis la base
async function PhotographerContent({ params }) {
  await connection();
  const { id } = await params;
  const photographerId = Number(id);

  // Identifiant non numérique ou photographe inconnu : page 404
  if (!Number.isInteger(photographerId)) notFound();

  const photographer = await getPhotographer(photographerId);
  if (!photographer) notFound();

  const medias = await getAllMediasForPhotographer(photographerId);

  return (
    <>
      <PhotographerBanner photographer={photographer} />
      <MediaGallery photographerPrice={photographer.price} initialMedias={medias} />
    </>
  );
}
