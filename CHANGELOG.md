# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-04

### Features

- **Auth** — Authentification complète (inscription, connexion, remember me, protection CSRF/rate limiting)
- **Agenda** — Gestion d'événements avec vue journalière, mensuelle et page "aujourd'hui"
- **Compteurs** — Création, incrémentation et épinglage de compteurs personnalisés
- **Journal** — Journalisation quotidienne avec suppression d'entrées
- **Shopping** — Liste de courses
- **PWA** — Application installable avec service worker custom (support offline)
- **Thème** — Système de thèmes avec sélecteur dans les paramètres

### Improvements

- Réglage du nombre de jours affichés dans l'agenda
- Nouveau composant Switch dans les formulaires
- État "liste vide" sur le journal et l'agenda
- Version de l'app déplacée dans les paramètres
- Cache applicatif via BentoCake (Redis)

### Tech

- AdonisJS v7, Node 24 LTS, pnpm 10
- Tests fonctionnels et unitaires (agenda, compteurs, journal, auth, aujourd'hui)
- Infrastructure Docker (dev + prod) avec service de migration dédié
- CI/CD GitHub Actions, déploiement NAS auto-hébergé
