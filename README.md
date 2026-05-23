# Todo REST API – DEP LB2

Eine produktionsreife Todo REST API mit Express.js und PostgreSQL.
Containerisiert mit Docker, automatisch deployed über GitHub Actions auf Render.

* **Live-URL (Production):** [https://dep-lb2.onrender.com](https://dep-lb2.onrender.com)
* **Live-URL (Development):** [https://dep-lb2-1.onrender.com](https://dep-lb2-1.onrender.com)
* **API Dokumentation:** [https://dep-lb2.onrender.com/api-docs](https://dep-lb2.onrender.com/api-docs)

---

## Projektübersicht

Diese Anwendung ist eine REST API zur Verwaltung von Todo-Einträgen.
Sie wurde im Rahmen des Moduls DEP entwickelt, um den vollständigen Deployment-Prozess zu demonstrieren: vom lokalen Code bis zur laufenden Anwendung in der Cloud.

### Was die API kann

| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/todos` | GET | Alle Todos abrufen |
| `/todos` | POST | Neues Todo erstellen |
| `/todos/:id` | PUT | Todo aktualisieren |
| `/todos/:id` | DELETE | Todo löschen |
| `/health` | GET | Systemstatus prüfen |
| `/metrics` | GET | Uptime und Memory |
| `/api-docs` | GET | Swagger UI |

---

## Architekturübersicht

---

## Architekturübersicht

```mermaid
graph TD
    A[Developer] -->|git push| B[GitHub]
    B -->|trigger| C[GitHub Actions]
    C -->|lint+test| D{OK?}
    D -->|Nein| E[Stop]
    D -->|dev| F[Render dev]
    D -->|main| G[Render prod]
    F -->|DB| H[Neon]
    G -->|DB| H
    I[Browser] -->|HTTPS| G
Zwei Services:Express API: Docker Container auf Render.PostgreSQL: Managed Database auf Neon.Kommunikation: Die Services kommunizieren via DATABASE_URL.Technologie-StackTechnologieZweckNode.js 20 + Express.jsBackend FrameworkPostgreSQLRelationale DatenbankDocker + Docker ComposeContainerisierungGitHub ActionsCI/CD PipelineRenderCloud Deployment (dev + prod)NeonManaged PostgreSQLSwagger UIAPI DokumentationJest + SupertestAutomatisierte TestsESLintCode-QualitätdotenvEnvironment-VariablenSetup-AnleitungVoraussetzungenNode.js 20+Docker DesktopGit1. Repository klonenBashgit clone [https://github.com/fatmagulfidan/DEP_LB2.git](https://github.com/fatmagulfidan/DEP_LB2.git)
cd DEP_LB2
2. Umgebungsvariablen einrichtenBashcp .env.example .env
.env Datei anpassen:Kod snippet'iPORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/tododb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=tododb
3. Mit Docker Compose startenBashdocker compose up --build
4. Datenbank migrierenBashnode src/db/migrate.js
5. API aufrufenSwagger UI: http://localhost:3000/api-docsHealth Check: http://localhost:3000/healthMetrics: http://localhost:3000/metrics6. Tests ausführenBashnpm test
CI/CD PipelineBei jedem Push läuft folgende Pipeline automatisch.Zwei Umgebungen:UmgebungBranchURLProductionmainhttps://dep-lb2.onrender.comDevelopmentdevhttps://dep-lb2-1.onrender.comAblauf:Push auf dev: lint, audit, test $\rightarrow$ deploy-devPush auf main: lint, audit, test $\rightarrow$ deploy-prodBenötigte GitHub Secrets:SecretBeschreibungRENDER_DEPLOY_HOOKProduction Deploy HookRENDER_DEPLOY_HOOK_DEVDevelopment Deploy HookProduktionsreifeMerkmalUmsetzungContainerisiertMulti-stage Dockerfile mit Non-Root-User; docker-compose.yml für lokale EntwicklungAutomatisiertGitHub Actions: Lint + Audit + Tests bei jedem Push, Deployment nur bei ErfolgKonfigurierbarSecrets in Environment-Variablen; .env in .gitignore; .env.example im Repo; Multi-Environment (dev/prod)ErreichbarStabil unter https://dep-lb2.onrender.com erreichbarÜberwachbarGET /health prüft Datenbankverbindung; GET /metrics zeigt Uptime und MemoryDokumentiertREADME mit Architektur, Setup-Anleitung und EntscheidungsbegründungenEntscheidungsbegründungenWarum Render?Ich habe Render, Railway und Fly.io verglichen. Railway hat ein gutes Free Tier, aber eingeschränkte Docker-Unterstützung. Fly.io erfordert eine CLI-Installation und ist komplexer zu konfigurieren. Render bietet native Docker-Unterstützung, automatisches HTTPS, direkte GitHub-Integration und eine einfache Weboberfläche — deshalb war es die beste Wahl für dieses Projekt.Warum Neon statt Render PostgreSQL?Render erlaubt nur eine kostenlose Datenbank pro Account. Alternativen waren Supabase und PlanetScale. Supabase bietet mehr Features, war aber für eine einfache REST API überdimensioniert. Neon ist spezialisiert auf PostgreSQL, hat ein grosszügiges Free Tier, automatisches SSL und einfache Integration — die schlankste Lösung.Warum Express.js?Alternativen waren Fastify und NestJS. Fastify ist performanter, aber die Community ist kleiner. NestJS ist zu komplex für eine einfache REST API. Express ist das meistgenutzte Node.js Framework, gut dokumentiert und einfach testbar.Warum Multi-Stage Dockerfile?Ein Single-Stage Dockerfile hätte ein grösseres Image erzeugt. Multi-Stage trennt Build- und Runtime-Umgebung: Das finale Image enthält nur Production-Dependencies. Der Non-Root-User ist eine Security Best Practice.Warum Swagger UI?Alternativen waren Postman oder manuelle Dokumentation. Swagger UI generiert automatisch interaktive Dokumentation direkt aus dem Code — immer aktuell, im Browser nutzbar, kein Extra-Tool nötig.LearningsDocker Networking: In Docker Compose müssen Services über ihren Servicenamen kommunizieren (z.B. db:5432), nicht über localhost. Das führte anfangs zu Verbindungsfehlern.Jest Hanging: Jest beendet sich nicht automatisch, wenn ein Express-Server noch läuft. Lösung: --forceExit Flag hinzufügen.Free Tier Limits: Render erlaubt nur eine kostenlose PostgreSQL-Instanz pro Account — daher Wechsel zu Neon.Environment Variables in Docker: Die .env Datei wird nicht in den Container kopiert — Variablen werden über docker-compose.yml übergeben.ESLint Konfiguration: ESLint erkennt Node.js-Globals nicht automatisch — sie müssen explizit deklariert werden.Multi-Environment: Dev und Prod brauchen separate Deploy Hooks — teilen aber dieselbe Neon Datenbank.ProjektstrukturPlaintextDEP_LB2/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── db/
│   │   ├── pool.js
│   │   └── migrate.js
│   ├── routes/
│   │   └── todos.js
│   ├── __tests__/
│   │   └── health.test.js
│   └── index.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── eslint.config.js
└── README.md
KI-NutzungDieses Projekt wurde mit Unterstützung von Claude AI (Anthropic) entwickelt.KI wurde verwendet für: Code-Scaffolding, Dockerfile-Optimierung, GitHub Actions Konfiguration und README-Erstellung.Alle Implementierungen wurden verstanden, getestet und manuell angepasst.