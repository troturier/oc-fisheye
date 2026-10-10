# Journal – FishEye

Historique daté, plus récent en haut.

---

## 2026-10-10 – HTML pour validation AChecker et publication sur GitHub

**Fait**
- **HTML des pages** généré dans `validation-html/` (non versionné) : accueil, page photographe, page photographe avec la
  modale de contact ouverte, avec la lightbox ouverte, et page 404. Chaque fichier est autonome (CSS intégrée) et prêt à coller
  dans l'onglet « Paste HTML » d'AChecker.
- **Dépôt GitHub public** : https://github.com/troturier/oc-fisheye (branche `main`, 1 commit).
- Clone neuf testé en suivant le README : migration, seed (6 photographes, 59 médias), lint et build passent.

**Problèmes rencontrés**
- Le HTML renvoyé par le serveur est découpé en blocs de streaming (`<template>`, `<div hidden>`) : inutilisable
  tel quel dans un validateur, le contenu n'y est pas à sa place finale.
- La règle `.env*` du `.gitignore` masquait aussi `.env.example`, pourtant nécessaire au README.
- Aucune identité git n'était configurée sur la machine.

**Raisonnement**
- HTML récupéré depuis le **DOM final du navigateur** (après affichage), via un récepteur local temporaire
  (`127.0.0.1`, rien d'envoyé à l'extérieur), puis nettoyé : scripts, marqueurs de streaming et préchargements retirés,
  feuilles de style intégrées pour que AChecker évalue aussi les contrastes. Balises vérifiées équilibrées.
- Les états « modale ouverte » et « lightbox ouverte » sont fournis à part : AChecker lit du HTML statique et ne
  verrait pas le contenu des modales fermées.
- Nom `oc-fisheye` et visibilité publique : cohérent avec les autres projets OpenClassrooms du compte, et la fiche
  d'auto-évaluation exige un code public.
- Commits signés avec l'adresse `noreply` GitHub plutôt que l'adresse personnelle, le dépôt étant public.
- Exception `!.env.example` ajoutée au `.gitignore` ; `.env` et `dev.db` restent exclus.
- `resources/` (briefing, notes de réunion, fiche d'auto-évaluation) exclu du dépôt : documents de cours, pas du livrable.
- Contrôle avant publication : aucun secret détecté, aucun fichier de plus de 11 Mo.

**Reste à faire**
1. Coller les 5 fichiers de `validation-html/` dans AChecker et corriger ce qu'il remonte.
2. Test avec un lecteur d'écran.
3. Décision sur le sous-titrage des 4 vidéos avec audio.
4. Remplir la fiche d'auto-évaluation PDF.

---

## 2026-10-10 – Audit d'accessibilité automatisé (étape 7) et bilan avant livraison

**Fait**
- Audit avec **axe-core 4.14** (règles WCAG 2.0, 2.1, 2.2 niveaux A et AA, plus bonnes pratiques), installé hors du projet
  (dossier temporaire) pour ne pas ajouter de dépendance. Exécuté dans le navigateur sur : accueil, page photographe,
  modale de contact ouverte, menu de tri ouvert, lightbox (photo et vidéo).
- Une violation trouvée et corrigée : les libellés du formulaire (`#525252` sur `#DB8876`) avaient un contraste de 2,9.
  Passés en noir. Résultat final : **0 violation** sur tous les états testés.

**Problèmes rencontrés**
- Première mesure : « aucun `h1` ». Cause : l'onglet du navigateur était masqué (`visibilityState = hidden`),
  et React diffère alors la substitution du loader par le contenu. Artefact de test, pas un bug : refait onglet au premier plan.
- Règle `video-caption` en « à vérifier » : l'outil ne peut pas juger. 4 vidéos sur 6 ont une piste audio (AAC),
  2 sont muettes (`Animals_Puppiness`, `Architecture_coverr_circle_empty_highway…`).

**Raisonnement**
- Respecter le contraste (WCAG) prime sur la fidélité à un gris choisi sans vérification de contraste.
- Pas de sous-titres inventés : je ne connais pas le contenu sonore des vidéos. Décision à prendre (voir ci-dessous).
- axe-core n'est **pas** AChecker : même famille de règles, mais le test AChecker et le lecteur d'écran restent à faire.

### Bilan face à la fiche d'auto-évaluation

| Indicateur | État |
|---|---|
| Application Next.js créée, SQLite utilisée | Fait |
| Pas de dépendance inutile | Fait (dépendances : Prisma, adaptateur SQLite, dotenv ; `tsx` en dev pour le seed, demandé par le guide) |
| Interface conforme aux maquettes | Fait, mesuré (voir entrée précédente) |
| HTML sémantique, ARIA, texte alternatif | Fait, 0 violation axe |
| AChecker sans « known issue » | **Non vérifié** (outil en ligne) |
| Navigation au clavier | Fait (testée : tri, lightbox, formulaire) |
| Accueil, galerie, titres, likes, total des likes | Fait |
| Navigation vers la page photographe | Fait |
| Like persisté, tri popularité / date / titre | Fait |
| Lightbox (croix, boutons, flèches) | Fait |
| Contact : modale, 3 champs affichés dans la console | Fait |
| Données lues en Server Components, loader, message d'erreur | Fait |
| Fonctions de lecture / mise à jour / erreur retournée | Fait |
| Code public sur GitHub, aucune donnée sensible | **À faire** (`.env` exclu, mais dépôt non créé) |

**Reste à faire**
1. Test **AChecker** (https://www.achecker.ca) et test avec un **lecteur d'écran** : à faire par Thibault.
2. Créer le dépôt GitHub public et pousser le code.
3. Décider du sous-titrage des 4 vidéos avec audio.
4. Remplir la fiche d'auto-évaluation PDF.

---

## 2026-10-10 – Comparaison chiffrée avec la maquette (étapes 2, 3, 5 : mise en page)

**Fait** : les écarts de mise en page ont été mesurés dans le navigateur à 1440×1024 (taille des frames Figma)
et corrigés.

**Problème rencontré** : la première vérification se faisait sur des captures réduites (0,6 à 0,7), et l'outil de capture
ramène même une capture pleine taille à 800 px de large. Des écarts de 10 à 100 px passaient inaperçus.

**Raisonnement** : accéder au Chrome de l'utilisateur n'aurait donné qu'une capture de l'onglet Figma, moins précise que
les exports du bridge DesignAgent. J'ai donc comparé des **mesures** : positions et tailles réelles des éléments
(`getBoundingClientRect`) contre les valeurs de la maquette. La barre de défilement (15 px) explique les largeurs de 345 px
au lieu de 350 px.

| Élément | Avant | Maquette | Après |
|---|---|---|---|
| Logo (x) | 48 | ≈ 98-100 | 100 |
| Titre « Nos photographes » (bord droit) | 1292 | ≈ 1340 | 1340 |
| Centres des 3 colonnes de l'accueil | 264 / 720 / 1176 | 200 / 717 / 1235 | 200 / 720 / 1240 |
| Portraits de l'accueil (y) | 134 | 202 | 202 (2e rangée : 593 pour 595) |
| Bandeau photographe (y) | ≈ 114 | 133 | 133 |
| Bouton « Contactez-moi » | 198×70 à y=255 | 170×69 à y=270 | 174×70 à y=270 |
| Pas entre rangées de médias | 381 | 371 | ≈ 371 (hors titres sur 2 lignes) |
| Colonne image de la lightbox | 1070 | 1050 | 1050 |
| Croix de la lightbox (y) | 34 | ≈ 62 | 63 |

**Écarts conservés**
- Lightbox centrée verticalement (y=22) plutôt qu'à y=40 : plus robuste selon la hauteur de la fenêtre.
- Un titre de média trop long passe sur 2 lignes (ex. « Wild horses in the mountains ») et allonge la rangée ; la maquette
  n'a que des titres courts.
- Encart de likes un peu plus étroit que la maquette (le total y est « 680 » et non « 297 081 »).
- Les valeurs de la lightbox après correction (colonne de 1050 px, croix) ont été calculées, pas remesurées.
- Pas de comparaison pixel à pixel ni de test sur d'autres tailles d'écran.

---

## 2026-10-10 – Réalisation du prototype (étapes 1 à 7)

**Résultat** : prototype fonctionnel. `npm run lint` et `npm run build` passent sans erreur.
Fonctionnalités vérifiées dans le navigateur : navigation, likes persistés en base, tri, lightbox, formulaire de contact.

**Sources analysées** : `resources/README.md` (briefing), `Notes de réunion.pdf`, `Fiche d'auto-évaluation.pdf`,
guide d'installation Prisma (`docs/guide-bdd.md`) et maquette Figma lue via le bridge DesignAgent
(4 écrans, guide de style, tableaux d'annotations d'accessibilité).

### Étape 1 – Préparer le projet

**Fait**
- Projet Next.js 16.4 en JavaScript (App Router, ESLint, sans Tailwind), généré dans le dossier du projet.
- Prisma + SQLite : schéma `Photographer` / `Media`, migration `init`, seed exécuté une seule fois
  (6 photographes, 59 médias).
- `app/lib/prisma-db.js` : les 4 fonctions du guide, plus `incrementMediaLikes`.
- Médias déplacés de `assets/` vers `public/`. Logo exporté depuis Figma en `public/logo.svg`.

**Problèmes rencontrés**
- `npm install prisma` aurait installé une RC 8 (tag `latest`) alors que `@prisma/client` est en 7.10.0.
- Le guide date d'avant Prisma 7 : un adaptateur de driver est obligatoire, la config passe par `prisma.config.ts`
  et le client est généré dans `app/generated/prisma`.
- `prisma init` a créé `prisma7.config.ts` (nom incorrect) et téléchargé des dossiers de skills
  (`.agents`, `.claude`, `.windsurf`) et `skills-lock.json`.
- Mon contrôle de la base a créé un `prisma/dev.db` vide : la vraie base est `dev.db` à la racine
  (chemin relatif résolu depuis la racine du projet).
- Deux fichiers référencés par les données n'existaient pas : `Travel _Adventure_Door.jpg` (espace parasite)
  et `Architecure_Contrast.jpg` (faute de frappe).
- ESLint remontait 10 warnings sur le code généré par Prisma.

**Raisonnement**
- Prisma et son client fixés en 7.10.0 pour rester alignés, avec `@prisma/adapter-better-sqlite3`, `dotenv` et `tsx`
  (ce dernier demandé par le guide pour le seed).
- Config renommée en `prisma.config.ts` ; seed déclaré dans cette config plutôt que dans `package.json`.
- Les dossiers de skills, `skills-lock.json` et le `prisma/dev.db` vide, générés par mes propres commandes,
  ont été supprimés : ce n'est pas du code du projet.
- Fichiers renommés dans `public/` plutôt que modifier les données, qui font foi.
- `app/generated/**` exclu d'ESLint (code généré). `/dev.db` ajouté au `.gitignore` : la base se recrée par migration + seed.
- `README.md` du repo d'origine déplacé vers `docs/guide-bdd.md`, remplacé par un README du projet.

### Étape 2 – Page d'accueil

**Fait**
- Styles globaux (couleurs du guide de style, police DM Sans via `next/font`, focus visible, lien d'évitement).
- Composants `Header`, `PhotographerList` (Server Component), `PhotographerCard`, `Loader`.
- Grille de 3 colonnes, 2 puis 1 sur écrans plus étroits. Pages `error.js` et `not-found.js`.

**Problèmes rencontrés**
- `cacheComponents: true` est activé dans `next.config.mjs` (par défaut dans cette version) : lire la base hors
  `<Suspense>` est refusé, et la page risquait d'être figée dans le shell statique.
- Les ports 3000 et 3100 étaient déjà occupés par d'autres processus (un bridge WhatsApp et un autre `next-server`).
- Warnings console : logo rétréci par le flex, image LCP sans `priority`.

**Raisonnement**
- Lecture en base dans un composant sous `<Suspense>` précédé de `await connection()` : les données restent
  dynamiques et le fallback fait office de loader (point de la fiche d'auto-évaluation).
- Carte conforme à l'annotation Figma : le lien englobe le portrait (`alt=""`) et le `h2` du nom.
- Serveur de test lancé sur le port 3456 ; les processus tiers n'ont pas été touchés.
- `flex-shrink: 0` sur le logo et `priority` sur les 3 premiers portraits.

**Écart connu** : les photographes sortent par `id` croissant, alors que la maquette suit l'ordre du fichier JSON
(Mimi, Ellie-Rose, Tracy…). L'ordre d'insertion n'est pas conservé en base car `id` est la clé primaire.

### Étape 3 – Navigation vers la page photographe

**Fait**
- Route `app/photographers/[id]/page.js`, liens depuis l'accueil, `PhotographerBanner`, galerie, encart fixe.
- Titre d'onglet propre à chaque photographe (`generateMetadata`).

**Problèmes rencontrés**
- `params` est une promesse dans cette version : l'attendre hors `<Suspense>` est refusé avec `cacheComponents`.
- Une page 404 renvoie un statut HTTP 200 : le `notFound()` survient après l'envoi du début de la réponse (streaming).

**Raisonnement**
- La page est synchrone ; un composant interne sous `<Suspense>` attend `params`, valide l'identifiant
  (non numérique ou inconnu : `notFound()`), puis charge photographe et médias.
- Alt du portrait = nom du photographe, alt des médias = titre, comme demandé dans les notes de réunion.
- Statut 200 sur la 404 : accepté. Le contenu « Page introuvable » et `noindex` sont bien servis.

### Étape 4 – Modale de contact

**Fait**
- Composant `Modal` générique (`<dialog>` natif) et `ContactModal` (bouton + formulaire Prénom, Nom, Email, Message).
- À l'envoi, les 4 champs sont affichés dans la console puis la modale se ferme.

**Raisonnement**
- `<dialog>` + `showModal()` donne gratuitement piège de focus, Échap, rôle `dialog` et restitution du focus
  au bouton déclencheur. Fermeture aussi par la croix et par clic sur l'arrière-plan.
- Le contenu n'est monté que quand la modale est ouverte : le formulaire est donc vidé à chaque ouverture.
- Titre en `h2` et non `h1` comme dans l'annotation Figma : la page a déjà un `h1` (le nom du photographe).
- Nom accessible de la croix : « Fermer le formulaire de contact ».

### Étape 5 – Lightbox

**Fait**
- `Lightbox` réutilisant `Modal` : boutons précédent/suivant, croix, légende, flèches gauche/droite du clavier
  (`KeyboardEvent.key`), Échap. Photos et vidéos (avec contrôles).

**Raisonnement**
- Navigation circulaire (après le dernier, retour au premier) et suivant l'ordre de tri courant.
- Sur un lecteur vidéo, les flèches restent réservées à la lecture ; pas de lecture automatique (audio).
- Boutons nommés en français (« Média précédent », « Média suivant », « Fermer la vue agrandie »).

### Étape 6 – Likes

**Fait**
- Server Action `likeMedia` (`app/actions.js`) → `incrementMediaLikes`, incrémentation atomique en base.
- Compteur par média et total dans l'encart, mis à jour tout de suite (mise à jour optimiste).
- En cas d'échec : retour arrière du compteur et message d'erreur annoncé (`role="alert"`).

**Problèmes rencontrés**
- Mes tests ont ajouté un like réel en base (142 → 143).

**Raisonnement**
- Une Server Action est joignable par POST direct : l'identifiant est validé côté serveur.
- Le guide propose `updateNumberOfLikes(id, nouveauTotal)` ; l'incrément atomique évite de perdre des likes
  si deux clics arrivent en même temps. La fonction du guide est conservée.
- Le sujet dit « incrémenter » : un clic = +1, sans annulation possible. Un système like/unlike serait une amélioration.
- Valeur remise à 142 après les tests (base identique au seed).
- Nom accessible du bouton like : « J'aime « titre », N j'aime actuellement » (plus informatif que « likes » seul).

### Étape 7 – Tri et accessibilité

**Fait**
- `SortMenu` : motif listbox ARIA (`aria-haspopup`, `aria-expanded`, `aria-activedescendant`, `aria-selected`,
  `aria-labelledby`), pilotable aux flèches, Début/Fin, Entrée/Espace, Échap, Tab.
- Tri par popularité (décroissant), date (récent d'abord) ou titre (ordre alphabétique français).
- Contrôle DOM : un seul `h1`, aucune image sans `alt`, aucun bouton ou vidéo sans nom, aucun `id` dupliqué.

**Raisonnement**
- Menu personnalisé plutôt qu'un `<select>` pour coller à la maquette (liste rouge) : l'annotation Figma autorise les deux.
- L'ordre n'est recalculé que lorsqu'on change de tri : sinon un like déplacerait la carte sous le curseur.
- La fiche d'auto-évaluation cite un tri par date, absent des notes de réunion : implémenté.

### Problèmes transverses

- `next dev` a créé un `tsconfig.json` (détection de fichiers `.ts`), et le build échouait sur
  `prisma.config.ts` (types Node absents). Plutôt que d'ajouter TypeScript et `@types/node` à un projet JS,
  `prisma.config.ts` et `app/generated` sont exclus du type-check.
- Mon `cd` dans des sous-dossiers a plusieurs fois décalé le répertoire de travail : chemins absolus ensuite.

### Reste à faire / limites

- **Non vérifié** : test AChecker (outil en ligne) et test avec un lecteur d'écran, demandés par les notes de réunion.
  Seul un contrôle DOM a été fait, sans script externe.
- **Non vérifié** : écart visuel fin avec la maquette (comparaison faite à l'œil sur des captures réduites).
- Vidéos sans sous-titres (aucun fichier fourni).
- Dépôt public GitHub non créé : le dossier n'est pas un dépôt git. À faire avant livraison, en vérifiant que `.env` reste exclu.
- Remplir la fiche d'auto-évaluation une fois AChecker et le lecteur d'écran passés.
