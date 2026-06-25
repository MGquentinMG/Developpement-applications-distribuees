# 🌬️ Breezy — Réseau social distribué

## Lancer le projet

```bash
docker-compose up -d
```

L'application sera disponible sur **http://localhost**

---

## Accès et URLs

| Service | URL | Identifiants |
|---|---|---|
| **Application** | http://localhost | voir ci-dessous |
| **API Swagger** | http://localhost/docs | — |
| **Base de données** (Mongo Express) | http://localhost:8081 | `admin` / `admin123` |
| **Vault** (gestion des secrets) | http://localhost:8200 | Token : `breezy_dev_root` |

---

## Première connexion Admin

Un compte administrateur est créé automatiquement au premier démarrage.

| Champ | Valeur |
|---|---|
| **Email** | `admin@exemple.com` |
| **Mot de passe** | `Admin1234!` |

> Au premier login, une popup obligatoire s'affiche pour définir un nouveau mot de passe avant d'accéder à l'application.

---

## Panneau d'administration

Connecté en tant qu'admin, accède à **http://localhost/admin** pour :

- Approuver les nouveaux comptes (les inscriptions sont en attente par défaut)
- Créer des comptes directement (actifs immédiatement)
- Consulter et résoudre les signalements
- Bannir / débannir des utilisateurs

---

## Rebuild complet

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
