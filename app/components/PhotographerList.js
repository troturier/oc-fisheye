import { connection } from "next/server";
import { getAllPhotographers } from "../lib/prisma-db";
import PhotographerCard from "./PhotographerCard";
import styles from "./PhotographerList.module.css";

// Server Component : lit la base à chaque requête. Une erreur remonte à app/error.js
export default async function PhotographerList() {
  await connection();
  const photographers = await getAllPhotographers();

  if (photographers.length === 0) {
    return <p className={styles.empty}>Aucun photographe disponible pour le moment.</p>;
  }

  return (
    <ul className={styles.list}>
      {photographers.map((photographer, index) => (
        <li key={photographer.id}>
          {/* Les portraits de la première ligne sont chargés en priorité (LCP) */}
          <PhotographerCard photographer={photographer} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
