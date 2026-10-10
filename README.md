# FishEye

Prototype du site FishEye : une plateforme de photographes freelance (projet OpenClassrooms).
Next.js 16 (App Router), React 19, Prisma 7 + SQLite.

## Fonctionnalités

- Page d'accueil listant les photographes (portrait, nom, lieu, slogan, tarif).
- Page photographe : bandeau de présentation, galerie de photos et de vidéos.
- Likes par média, enregistrés en base, avec total affiché dans l'encart en bas de page.
- Tri par popularité, date ou titre (menu accessible au clavier).
- Lightbox (flèches du clavier, boutons, croix, Échap) et formulaire de contact en modale.
- États de chargement, d'erreur et page 404.

## Installation

Prérequis : Node.js 22 ou supérieur.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

Le seed ne doit être exécuté qu'**une seule fois**. Pour repartir de zéro, supprimer `dev.db` puis relancer
`npx prisma migrate dev` et `npx prisma db seed`.

La variable `DATABASE_URL` (`file:./dev.db`) est lue dans `.env`, non versionné : `.env.example` en donne le modèle.

## Lancer le projet

```bash
npm run dev      # développement, http://localhost:3000
npm run build    # build de production
npm start        # serveur de production
npm run lint     # ESLint
```

## Structure

| Chemin | Rôle |
|---|---|
| `app/page.js` | Page d'accueil |
| `app/photographers/[id]/page.js` | Page d'un photographe |
| `app/components/` | Composants (cartes, galerie, modales, tri, lightbox…) |
| `app/lib/prisma-db.js` | Accès à la base (lecture des photographes et médias, likes) |
| `app/actions.js` | Server Action d'ajout d'un like |
| `prisma/` | Schéma, migration et seed |
| `data/` | Données sources du seed (JSON) |
| `docs/guide-bdd.md` | Guide d'installation fourni par l'équipe back-end |

## Choix techniques

- **Cache Components** est activé : les lectures en base se font dans des composants sous `<Suspense>`
  (le fallback sert de loader) après `await connection()`, pour ne pas figer les données dans le shell statique.
- **Prisma 7** impose un adaptateur de driver : `@prisma/adapter-better-sqlite3`.
- **Modales** : un composant `Modal` générique basé sur `<dialog>` natif, partagé par le formulaire et la lightbox.
- **Likes** : mise à jour optimiste côté client, puis persistance par Server Action avec annulation si la base échoue.

## Accessibilité

HTML sémantique, `alt` sur toutes les images (titre du média, nom pour un portrait), nom accessible sur toutes les
vidéos et tous les boutons, navigation complète au clavier, focus visible, lien d'évitement, modales natives.
Les vidéos fournies n'ont pas de sous-titres.
