import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.ts";

// Instance unique du client, réutilisée entre les rechargements à chaud en développement
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Liste de tous les photographes (page d'accueil)
export const getAllPhotographers = () => prisma.photographer.findMany();

// Un photographe par identifiant ; renvoie null s'il n'existe pas
export const getPhotographer = (id) =>
  prisma.photographer.findUnique({
    where: { id },
  });

// Tous les médias d'un photographe (le tri est fait côté client)
export const getAllMediasForPhotographer = (photographerId) =>
  prisma.media.findMany({
    where: { photographerId },
  });

// Ajoute un like à un média et renvoie le média mis à jour.
// Incrémentation atomique côté base : évite de perdre des likes si plusieurs clics arrivent en même temps
export const incrementMediaLikes = (mediaId) =>
  prisma.media.update({
    where: { id: mediaId },
    data: { likes: { increment: 1 } },
  });
