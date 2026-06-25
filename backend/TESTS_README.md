# Tests back-end (Vitest)

Mise en place de tests automatisés sur le back-end Fastify, avec le **même
outil que le front-end (Vitest)**.

## Fichiers fournis
- `vitest.config.mjs` — configuration Vitest (environnement Node, globals).
- `package.json` — scripts de test + dépendances de dev ajoutées.
- `src/**/*.test.js` — 5 fichiers de tests co-localisés à côté du code testé :
  - `src/utils/errorResponse.test.js`
  - `src/utils/successResponse.test.js`
  - `src/validators/authValidator.test.js`
  - `src/middlewares/auth.middleware.test.js`
  - `src/controllers/auth.controller.test.js`

## Installation
Décompressez l'archive à la racine de `backend/` (les fichiers se placent
automatiquement au bon endroit), puis :

    cd backend
    npm install

## Exécution
    npm test              # lance toute la suite une fois
    npm run test:watch    # mode watch (re-lance à chaque modification)
    npm run test:coverage # avec rapport de couverture

## Résultat attendu
22 tests répartis dans 5 fichiers, tous au vert (~1 s).
Couverture : 96 % des lignes et 100 % des branches sur les modules testés.

## Notes techniques
- Le contrôleur d'authentification charge ses dépendances en CommonJS
  (`require`). Pour l'isoler de MongoDB et de bcrypt sans base de données,
  les faux modules sont injectés via le cache `require`
  (`createRequire(import.meta.url)`) avant le chargement du contrôleur.
- Les tests ne nécessitent ni MongoDB, ni Redis, ni Vault : ils tournent
  partout (poste local, CI).
