"use client";

import { useState } from "react";
import { likeMedia } from "../actions";
import Lightbox from "./Lightbox";
import MediaCard from "./MediaCard";
import SortMenu from "./SortMenu";
import { HeartIcon } from "./Icons";
import styles from "./MediaGallery.module.css";

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularité" },
  { value: "date", label: "Date" },
  { value: "title", label: "Titre" },
];

// Renvoie les identifiants des médias triés selon le critère choisi
function getSortedIds(medias, sortBy) {
  const sorted = [...medias];

  if (sortBy === "popularity") {
    sorted.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    // Dates au format ISO (AAAA-MM-JJ) : la comparaison de chaînes suffit, du plus récent au plus ancien
    sorted.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
  }

  return sorted.map((media) => media.id);
}

// Galerie d'un photographe : tri, likes, lightbox et encart (total de likes + tarif)
export default function MediaGallery({ photographerPrice, initialMedias }) {
  const [medias, setMedias] = useState(initialMedias);
  const [sortBy, setSortBy] = useState("popularity");
  // L'ordre n'est recalculé que lorsqu'on change de tri : un like ne doit pas déplacer la carte sous le curseur
  const [orderedIds, setOrderedIds] = useState(() => getSortedIds(initialMedias, "popularity"));
  const [selectedId, setSelectedId] = useState(null);
  const [likeError, setLikeError] = useState("");

  const mediasById = new Map(medias.map((media) => [media.id, media]));
  const orderedMedias = orderedIds.map((id) => mediasById.get(id));
  const selectedIndex = selectedId === null ? null : orderedIds.indexOf(selectedId);
  const totalLikes = medias.reduce((total, media) => total + media.likes, 0);

  function handleSortChange(newSortBy) {
    setSortBy(newSortBy);
    setOrderedIds(getSortedIds(medias, newSortBy));
  }

  function changeLikes(mediaId, delta) {
    setMedias((current) =>
      current.map((media) =>
        media.id === mediaId ? { ...media, likes: media.likes + delta } : media,
      ),
    );
  }

  async function handleLike(mediaId) {
    setLikeError("");
    // Mise à jour optimiste : le compteur change tout de suite, puis on persiste en base
    changeLikes(mediaId, 1);

    let saved = false;
    try {
      const result = await likeMedia(mediaId);
      saved = result.success;
    } catch (error) {
      console.error(error);
    }

    if (!saved) {
      changeLikes(mediaId, -1);
      setLikeError("Le like n'a pas pu être enregistré. Veuillez réessayer.");
    }
  }

  return (
    <>
      <section className={styles.gallery} aria-label="Galerie du photographe">
        <SortMenu options={SORT_OPTIONS} value={sortBy} onChange={handleSortChange} />

        {/* Région vivante : l'erreur est annoncée par les lecteurs d'écran */}
        <p role="alert" className={styles.error}>
          {likeError}
        </p>

        <ul className={styles.grid}>
          {orderedMedias.map((media, index) => (
            <li key={media.id}>
              {/* Les médias de la première ligne sont chargés en priorité (LCP) */}
              <MediaCard
                media={media}
                priority={index < 3}
                onOpen={setSelectedId}
                onLike={handleLike}
              />
            </li>
          ))}
        </ul>
      </section>

      <aside className={styles.summary} aria-label="Total des likes et tarif">
        <p className={styles.likes}>
          <span>{totalLikes.toLocaleString("fr-FR")}</span>
          <HeartIcon size={24} />
          <span className="visually-hidden">likes au total</span>
        </p>
        <p>{photographerPrice}€ / jour</p>
      </aside>

      <Lightbox
        medias={orderedMedias}
        selectedIndex={selectedIndex}
        onNavigate={(index) => setSelectedId(orderedIds[index])}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
