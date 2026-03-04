# 🌿 Persist

Persist est une **PWA minimaliste d’organisation du quotidien**, pensée mobile-first.  
Elle permet de gérer ses routines, tâches, compteurs et un journal personnel, en se basant sur des **moments de la journée** plutôt que des horaires stricts.

## ✨ Fonctionnalités

- 🗓️ Agenda : tâches ponctuelles ou récurrentes (quotidien, hebdo, personnalisé)
- ☀️ Aujourd’hui : vue d’exécution par moment (Matin / Après-midi / Soir)
- 🔢 Compteurs : séries et comptes à rebours
- 📓 Journal : humeur quotidienne et notes libres
- 📱 PWA : utilisable hors-ligne, optimisée mobile

## 🧱 Stack technique

- **Node.js** `24.14.0`
- **pnpm** `10.30.3`
- **AdonisJS**
- **Docker / Docker Compose**
- **PostgreSQL**

## 🚀 Installation (développement)

### 1. Prérequis

- Node.js `24.14.0`
- pnpm `10.30.3`
- Docker & Docker Compose

### 2. Installation des dépendances

```bash
pnpm install
```

### 3. Environnement

```bash
cp .env.example .env
```

```bash
docker|podman compose -f compose.dev.yaml up -d
```

```bash
node ace migration:run
```

### 4. Développement

```bash
pnpm dev
```

### 5. Checks

#### Lint
```bash
pnpm lint
```
```bash
pnpm lint:fix
```

#### Format
```bash
pnpm format
```
```bash
pnpm format:fix
```