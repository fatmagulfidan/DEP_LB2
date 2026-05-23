# Todo REST API – DEP LB2

Eine produktionsreife Todo REST API mit Express.js und PostgreSQL.
Containerisiert mit Docker, automatisch deployed über GitHub Actions auf Render.

**Live-URL (Production):** https://dep-lb2.onrender.com
**Live-URL (Development):** https://dep-lb2-1.onrender.com
**API Dokumentation:** https://dep-lb2.onrender.com/api-docs

---

## Projektübersicht

Diese Anwendung ist eine REST API zur Verwaltung von Todo-Einträgen.
Sie wurde im Rahmen des Moduls DEP entwickelt, um den vollständigen Deployment-Prozess zu demonstrieren: vom lokalen Code bis zur laufenden Anwendung in der Cloud.

### Was die API kann

| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/todos` | GET | Alle Todos abrufen |
| `/todos` | POST | Neues Todo erstellen |
| `/todos/:id` | PUT | Todo aktualisieren (Titel oder Status) |
| `/todos/:id` | DELETE | Todo löschen |
| `/health` | GET | Systemstatus und Datenbankverbindung prüfen |
| `/metrics` | GET | Uptime, Request-Anzahl und Memory-Nutzung |
| `/api-docs` | GET | Interaktive API-Dokumentation (Swagger UI) |

---

## Architekturübersicht

```mermaid
graph TD
    A[Developer] -->|git push| B[GitHub]
    B -->|trigger| C[GitHub Actions]
    C -->|lint + audit + test| D{Tests OK?}
    D -->|Nein| E[Stop]
    D -->|dev branch| F[Render Dev]
    D -->|main branch| G[Render Prod]
    F -->|SQL| H[Neon PostgreSQL]
    G -->|SQL| H
    I[Browser] -->|HTTPS| G
```

**Zwei Services:**

- **Express API** - Docker Container auf Render
- **PostgreSQL** - Managed Database auf Neon

Die Services kommunizieren via `DATABASE_URL` (SSL-gesichert).

---

## Technologie-Stack

| Technologie | Zweck |
|---|---|
| Node.js 20 + Express.js | Backend Framework |
| PostgreSQL | Relationale Datenbank |
| Docker + Docker Compose | Containerisierung, lokale Entwicklung |
| GitHub Actions | CI/CD Pipeline |
| Render | Cloud Deployment Plattform (dev + prod) |
| Neon | Managed PostgreSQL in der Cloud |
| Swagger UI + swagger-jsdoc | API Dokumentation |
| Jest + Supertest | Automatisierte Tests |
| ESLint | Code-Qualität |
| dotenv | Konfiguration über Environment-Variablen |

---

## Setup-Anleitung

### Voraussetzungen

- Node.js 20+
- Docker Desktop
- Git

### 1. Repository klonen

```bash
git clone https://github.com/fatmagulfidan/DEP_LB2.git
cd DEP_LB2
```

### 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env
```

`.env` Datei anpassen:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/tododb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=tododb
```

### 3. Mit Docker Compose starten

```bash
docker compose up --build
```

### 4. Datenbank migrieren

```bash
node src/db/migrate.js
```

### 5. API aufrufen

- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health
- Metrics: http://localhost:3000/metrics

### 6. Tests ausführen

```bash
npm test
```

---

## CI/CD Pipeline

Bei jedem Push läuft folgende Pipeline automatisch.

**Zwei Umgebungen:**

| Umgebung | Branch | URL |
|---|---|---|
| Production | `main` | https://dep-lb2.onrender.com |
| Development | `dev` | https://dep-lb2-1.onrender.com |

**Ablauf:**

- Push auf `dev`: lint → audit → test → deploy-dev
- Push auf `main`: lint → audit → test → deploy-prod

**Benötigte GitHub Secrets:**

| Secret | Beschreibung |
|---|---|
| `RENDER_DEPLOY_HOOK` | Production Deploy Hook |
| `RENDER_DEPLOY_HOOK_DEV` | Development Deploy Hook |

---

## Produktionsreife

| Merkmal | Umsetzung |
|---|---|
| **Containerisiert** | Multi-stage Dockerfile mit Non-Root-User; docker-compose.yml für lokale Entwicklung |
| **Automatisiert** | GitHub Actions: Lint + Audit + Tests bei jedem Push, Deployment nur bei Erfolg |
| **Konfigurierbar** | Secrets in Environment-Variablen; `.env` in `.gitignore`; `.env.example` im Repo; Multi-Environment (dev/prod) |
| **Erreichbar** | Stabil unter https://dep-lb2.onrender.com erreichbar |
| **Überwachbar** | `GET /health` prüft Datenbankverbindung; `GET /metrics` zeigt Uptime und Memory |
| **Dokumentiert** | README mit Architektur, Setup-Anleitung und Entscheidungsbegründungen |

---

## Entscheidungsbegründungen

**Warum Render?**
Ich habe Render, Railway und Fly.io verglichen. Railway hat ein gutes Free Tier, aber eingeschränkte Docker-Unterstützung. Fly.io erfordert eine CLI-Installation und ist komplexer zu konfigurieren. Render bietet native Docker-Unterstützung, automatisches HTTPS, direkte GitHub-Integration und eine einfache Weboberfläche — deshalb war es die beste Wahl für dieses Projekt.

**Warum Neon statt Render PostgreSQL?**
Render erlaubt nur eine kostenlose Datenbank pro Account. Alternativen waren Supabase und PlanetScale. Supabase bietet mehr Features (Auth, Storage), war aber für eine einfache REST API überdimensioniert. Neon ist spezialisiert auf PostgreSQL, hat ein grosszügiges Free Tier (0.5 GB), automatisches SSL und einfache Integration über Connection String — die schlankste Lösung.

**Warum Express.js?**
Alternativen waren Fastify und NestJS. Fastify ist performanter, aber die Community ist kleiner. NestJS ist zu komplex für eine einfache REST API. Express ist das meistgenutzte Node.js Framework, gut dokumentiert und einfach testbar.

**Warum Multi-Stage Dockerfile?**
Ein Single-Stage Dockerfile hätte ein grösseres Image erzeugt. Multi-Stage trennt Build- und Runtime-Umgebung: Das finale Image enthält nur Production-Dependencies. Der Non-Root-User ist eine Security Best Practice — Root-Container gelten als Sicherheitsrisiko.

**Warum Swagger UI?**
Alternativen waren Postman oder manuelle Dokumentation. Postman erfordert einen separaten Download. Manuelle Dokumentation veraltet schnell. Swagger UI generiert automatisch interaktive Dokumentation direkt aus dem Code — immer aktuell, im Browser nutzbar.

---

## Learnings

- **Docker Networking:** In Docker Compose müssen Services über ihren Servicenamen kommunizieren (z.B. `db:5432`), nicht über `localhost`. Das führte anfangs zu Verbindungsfehlern.
- **Jest Hanging:** Jest beendet sich nicht automatisch, wenn ein Express-Server noch läuft. Lösung: `--forceExit` Flag.
- **Free Tier Limits:** Render erlaubt nur eine kostenlose PostgreSQL-Instanz — daher Wechsel zu Neon.
- **Environment Variables in Docker:** Die `.env` Datei wird nicht in den Container kopiert — Variablen werden über `docker-compose.yml` übergeben.
- **ESLint Konfiguration:** ESLint erkennt Node.js-Globals nicht automatisch — sie müssen explizit deklariert werden.
- **Multi-Environment:** Dev und Prod brauchen separate Deploy Hooks — teilen aber dieselbe Neon Datenbank.

---

## Projektstruktur

```
DEP_LB2/
├── src/
│   ├── db/
│   │   ├── pool.js           # PostgreSQL Connection Pool
│   │   └── migrate.js        # Tabellen erstellen
│   ├── routes/
│   │   └── todos.js          # CRUD Endpoints
│   ├── __tests__/
│   │   └── health.test.js    # Automatisierter Test
│   └── index.js              # Express App, Swagger, Metrics
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions Pipeline
├── Dockerfile                # Multi-stage, Non-Root
├── docker-compose.yml        # Lokale Entwicklung
├── .env.example              # Beispiel-Konfiguration
├── eslint.config.js          # ESLint Konfiguration
└── README.md
```

---

## KI-Nutzung

Dieses Projekt wurde mit Unterstützung von Claude AI (Anthropic) entwickelt.
KI wurde verwendet für: Code-Scaffolding, Dockerfile-Optimierung, GitHub Actions Konfiguration und README-Erstellung.
Alle Implementierungen wurden verstanden, getestet und manuell angepasst.
