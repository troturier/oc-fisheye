# Guide d’installation du Back-end et la BDD SQLite Fisheye

L’équipe back-end n’ayant pas encore développé les APIs nécessaires au bon fonctionnement de l’application, nous allons utiliser une technique assez répandue dans le prototypage qui consiste à utiliser une base de données SQLite (= données stockées en local).

## Initier la base de données

A la racine de votre projet, commencez d’abord par installer prisma avec la commande suivante:

`npm install prisma -D`

Puis initialisé prisma pour utiliser SQLite:

`npx prisma init --datasource-provider sqlite`

A ce stade vous devriez maintenant avoir un dossier `prisma` à la racine de votre projet.
Ouvrez le fichier `schema.prisma` contenu à l’intérieur et remplacez `env(“DATABASE_URL”)` par `"file:dev.db"`

Une fois cela réalisé, toujours dans le fichier schema.prisma, ajoutez à la fin du fichier le code suivant qui va définir les modèles de vos tables:

```js
model Photographer {
	id	Int	@id @default(autoincrement())
	name	String
	city	String
	country	String
	tagline	String
	price	Int
	portrait		String
    medias  Media[]
}

model Media {
	id	Int	@id @default(autoincrement())
	photographer	Photographer	@relation(fields: [photographerId], references: [id])
	photographerId	Int
	title	String
	image	String?
    video   String?
	likes	Int
	date	String
	price	Int
}
```

Puis exécutez la commande suivante qui permet de reporter les changements du schéma dans la base de données:

`npx prisma migrate dev --name init`

## Remplir les données

Vous pouvez maintenant installer le client prisma qui va vous permettre d'interagir avec votre base de données :

`npm install @prisma/client`

Puis

`npx prisma generate`

Toujours dans le dossier prisma, créez un nouveau fichier `seed.js` et coller le code suivant à l’intérieur:

```js
import { PrismaClient } from '../generated/prisma/client.ts';
import photographers from '../data/photographer.json' with { type: 'json' };
import medias from '../data/media.json' with { type: 'json' };

const prisma = new PrismaClient()

async function main() {
    await prisma.photographer.createMany({
        data: photographers
    });

    await prisma.media.createMany({
        data: medias // content from ./data/media.json
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
```

Enfin, ajoutez la nouvelle configuration de prisma dans votre `package.json` :

```js
  // ajoutez ceci juste en dessous de “version”
    "type": "module",
    "prisma": {
    "seed": "tsx prisma/seed.js"
}
```

Pour terminer, exécutez la commande `npx prisma db seed` pour insérer les données dans votre BDD. Vous êtes censé ne l’exécuter qu’une **seule** et **unique** fois.

Vous pouvez consulter vos données en utilisant la fonctionnalité studio de prisma en utilisant la commande `npx prisma studio`.

## Communiquer avec la BDD

Dans le dossier `app` de votre projet, créez un nouveau dossier lib puis un fichier à l’intérieur de ce dernier `prisma-db.js`. Dans ce fichier, insérez le code suivant:

```js
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

export const getAllPhotographers = () => prisma.photographer.findMany();

export const getPhotographer = (id) =>
  prisma.photographer.findUnique({
    where: { id },
  });

export const getAllMediasForPhotographer = (photographerId) =>
  prisma.media.findMany({
    where: { photographerId },
  });

export const updateNumberOfLikes = (mediaId, newNumberOfLikes) =>
  prisma.media.update({
    where: { id: mediaId },
    data: { likes: newNumberOfLikes },
  });
```

Dans ce dernier fichier, vous trouverez toutes les fonctions nécessaires qui vous permettront de communiquer avec la base de données au cours de ce projet. Vous pouvez les appeler directement depuis les server components pour récupérer les données qui vous intéressent.

## Placer les images dans votre projet

Pour terminer, n'oubliez pas déplacer tous les fichiers présents dans le dossier `./assets/` vers le dossier `./public/` à la racine de votre projet NextJS.

Si vous souhaitez en savoir plus à propos de l'usage de ce dossier vous pouvez vous référer à cette [page](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder) de la documentation.
