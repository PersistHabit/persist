# PROJECT_CONTEXT.md

## 1. Vision du projet

Persist est une application conçue pour résoudre le problème du manque de constance dans les projets personnels et les objectifs de vie. Beaucoup de personnes savent ce qu’elles veulent accomplir, mais abandonnent à cause du doute, de la dispersion ou d’un manque de structure claire.

Persist aide à transformer une intention en engagement durable grâce à un suivi simple, des rappels intelligents et une visualisation concrète de la progression. L’objectif : créer de la discipline sans pression, et rendre la constance presque naturelle.

Objectif :
- Simplicité
- Robustesse
- Maîtrise totale de l’architecture
- Évolutivité long terme

Ce projet ne doit PAS devenir :
- Une usine à gaz
- Un assemblage de dépendances inutiles
- Un produit guidé par l’IA au lieu de la réflexion

---

## 2. Stack technique

Backend :
- AdonisJS v6
- Node 24 LTS
- PostgreSQL 18
- Tests : Japa

Frontend :
- React + Inertia
- Vite
- PWA avec Service Worker custom

Infra :
- Docker (dev + prod)
- CI/CD GitHub Actions
- Déploiement NAS auto-hébergé

---

## 3. Principes d’architecture

- Code explicite > magie
- Pas d’abstraction prématurée
- Pas de dépendance si une solution simple native existe
- Respect strict des conventions existantes
- Ne jamais casser l’existant sans justification claire

---

## 4. Standards de code

- Fonctions courtes et lisibles
- Nommage explicite
- Pas de complexité inutile
- Pas de refactor massif sans demande
- Toujours expliquer les choix techniques

---

## 5. Règles d’utilisation de l’IA

Quand je te demande du code :

- Ne modifie que ce qui est demandé
- Ne réécris pas tout le fichier sauf demande explicite
- Respecte les versions imposées
- Pas de librairies supplémentaires sans justification
- Donne des réponses concises et actionnables

Si une décision d’architecture est impliquée :
- Propose 2–3 options
- Explique les trade-offs
- Ne décide pas à ma place

---

## 6. Philosophie

Persist est un projet construit avec intention.
Chaque choix doit être :
- Compris
- Justifié
- Maintenable
- Cohérent long terme