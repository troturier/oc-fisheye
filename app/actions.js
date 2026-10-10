"use server";

import { incrementMediaLikes } from "./lib/prisma-db";

/**
 * Ajoute un like à un média et renvoie le nouveau total.
 * Renvoie un objet { success, ... } plutôt que de lever une exception,
 * pour que l'interface puisse afficher un message d'erreur précis.
 */
export async function likeMedia(mediaId) {
  // Une Server Action est joignable par POST direct : on valide donc l'entrée
  if (!Number.isInteger(mediaId)) {
    return { success: false, error: "Identifiant de média invalide." };
  }

  try {
    const media = await incrementMediaLikes(mediaId);
    return { success: true, likes: media.likes };
  } catch (error) {
    console.error("Échec de l'ajout du like", error);
    return { success: false, error: "Impossible d'enregistrer le like." };
  }
}
