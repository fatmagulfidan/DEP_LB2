# Todo REST API – DEP LB2

Eine produktionsreife Todo REST API mit Express.js und PostgreSQL.  
Containerisiert mit Docker, automatisch deployed über GitHub Actions auf Render.

🔗 **Live-URL:** https://dep-lb2.onrender.com  
📖 **API Dokumentation:** https://dep-lb2.onrender.com/api-docs

---

## Projektübersicht

Diese Anwendung ist eine REST API zur Verwaltung von Todo-Einträgen.  
Sie wurde im Rahmen des Moduls DEP entwickelt, um den vollständigen Deployment-Prozess zu demonstrieren: vom lokalen Code bis zur laufenden Anwendung in der Cloud.

**Was die API kann:**

| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/todos` | GET | Alle Todos abrufen |
| `/todos` | POST | Neues Todo erstellen |
| `/todos/:id` | PUT | Todo aktualisieren (Titel oder Status) |
| `/todos/:id` | DELETE | Todo löschen |
| `/health` | GET | Systemstatus und Datenbankverbindung prüfen |
| `/api-docs` | GET | Interaktive API-Dokumentation (Swagger UI) |

---

## Architekturübersicht

```mermaid
graph TD
    A[Developer] -->|git push main| B[GitHub]
    B -->|trigger| C[GitHub Actions]
    C -->|npm test| D{Tests OK?}
    D -->|Ja| E[Deploy Hook]
    D -->|Nein| F[Stop]
    E --> G[Render]
    G -->|baut Docker Image| H[Express API Container]
    H <-->|PostgreSQL Verbindung| I[Neon Database]
    J[Browser] -->|HTTPS| H

    Zwei Services:

Express API – läuft in einem Docker Container auf Render
PostgreSQL – Managed Database auf Neon (externer Cloud-Dienst)
Die beiden Services kommunizieren über eine SSL-gesicherte Verbindung via DATABASE_URL.

Technologie-Stack
Technologie	Zweck
Node.js 20 + Express.js	Backend Framework
PostgreSQL	Relationale Datenbank
Docker + Docker Compose	Containerisierung, lokale Entwicklung
GitHub Actions	CI/CD Pipeline
Render	Cloud Deployment Plattform
Neon	Managed PostgreSQL in der Cloud
Swagger UI + swagger-jsdoc	API Dokumentation
Jest + Supertest	Automatisierte Tests
dotenv	Konfiguration über Environment-Variablen
Setup-Anleitung
Voraussetzungen
Node.js 20+
Docker Desktop
Git
1. Repository klonen
git clone https://github.com/fatmagulfidan/DEP_LB2.git
cd DEP_LB2
2. Umgebungsvariablen einrichten
cp .env.example .env
.env Datei anpassen:

PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/tododb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=tododb
3. Mit Docker Compose starten
docker compose up --build
4. Datenbank migrieren
node src/db/migrate.js
5. API aufrufen
Swagger UI: http://localhost:3000/api-docs
Health Check: http://localhost:3000/health
6. Tests ausführen
npm test
CI/CD Pipeline
Bei jedem Push auf main läuft folgende Pipeline automatisch:

git push → main
    └── Job: test
         ├── npm ci
         └── npm test
              └── (nur bei Erfolg) Job: deploy
                       └── Render Deploy Hook → neue Version live
Benötigter GitHub Secret:

Secret	Beschreibung
RENDER_DEPLOY_HOOK	URL zum Auslösen des Render Deployments
Produktionsreife
Merkmal	Umsetzung
Containerisiert	Multi-stage Dockerfile mit Non-Root-User; docker-compose.yml für lokale Entwicklung
Automatisiert	GitHub Actions: Tests laufen bei jedem Push, Deployment nur bei Erfolg
Konfigurierbar	Alle Secrets in Environment-Variablen; .env in .gitignore; .env.example im Repo
Erreichbar	Stabil unter https://dep-lb2.onrender.com erreichbar
Überwachbar	GET /health prüft aktiv die Datenbankverbindung
Dokumentiert	README mit Architektur, Setup-Anleitung und Entscheidungsbegründungen
Entscheidungsbegründungen
Warum Render?
Render unterstützt Docker-Deployments direkt aus GitHub, bietet kostenloses Hosting und automatisches HTTPS. Die Konfiguration ist einfacher als bei Fly.io (kein CLI nötig) und zuverlässiger als bei Heroku Free Tier.

Warum Neon statt Render PostgreSQL?
Render erlaubt nur eine kostenlose Datenbank pro Account. Neon ist ein spezialisierter Managed PostgreSQL-Dienst mit grosszügigem Free Tier, automatischem SSL und einfacher Integration über Connection String.

Warum Express.js?
Express ist das meistgenutzte Node.js Framework, gut dokumentiert und einfach testbar. Für eine REST API ohne Frontend ist es die effizienteste Wahl.

Warum Multi-Stage Dockerfile?
Multi-Stage Builds reduzieren die Image-Grösse erheblich, da nur Production-Dependencies ins finale Image kommen. Der Non-Root-User verbessert zusätzlich die Sicherheit.

Warum Swagger UI?
Swagger UI generiert automatisch eine interaktive Dokumentation direkt aus dem Code. So ist die API ohne externe Tools testbar und dokumentiert zugleich.

Learnings
Docker Networking: In Docker Compose müssen Services über ihren Servicenamen kommunizieren (z.B. db:5432), nicht über localhost. Das führte anfangs zu Verbindungsfehlern.
Jest Hanging: Jest beendet sich nicht automatisch, wenn ein Express-Server noch läuft. Lösung: --forceExit Flag hinzufügen.
Free Tier Limits: Render erlaubt nur eine kostenlose PostgreSQL-Instanz pro Account – daher Wechsel zu Neon als externe Datenbank.
Environment Variables in Docker: Die .env Datei wird nicht in den Container kopiert – Variablen werden über docker-compose.yml übergeben.
Projektstruktur
DEP_LB2/
├── src/
│   ├── db/
│   │   ├── pool.js           # PostgreSQL Connection Pool
│   │   └── migrate.js        # Tabellen erstellen
│   ├── routes/
│   │   └── todos.js          # CRUD Endpoints
│   ├── __tests__/
│   │   └── health.test.js    # Automatisierter Test
│   └── index.js              # Express App, Swagger Setup
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions Pipeline
├── Dockerfile                # Multi-stage, Non-Root
├── docker-compose.yml        # Lokale Entwicklung
├── .env.example              # Beispiel-Konfiguration
└── README.md