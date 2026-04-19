# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Gemini, Codex, etc.) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:9000
npm run build      # Production build to dist/
make start         # Start Docker containers
make startall      # Build and start Docker containers
make tar           # Build Docker image and save as tarball
make install       # Deploy from tarball on server
```

No test runner is configured.

## Environment

Copy `.env` and override with `.env.local`:

```
APP_MODE="dev"     # "prod" | "dev" | anything else activates fake GraphQL
API_URL="https://api.vergo.happykiller.net"
DEBUG=false
```

When `APP_MODE` is not `prod` or `dev`, the app uses `GraphqlServiceFake` instead of the real API — useful for local UI development without a backend.

## Architecture

**Webpack path aliases** — always use these instead of relative imports:
- `@src/` → `src/`
- `@pages/` → `src/pages/`
- `@components/` → `src/components/`
- `@usecases/` → `src/usecases/`
- `@services/` → `src/services/`
- `@stores/` → `src/stores/`
- `@hooks/` → `src/hooks/`

**Dependency injection** — `src/commons/inversify.ts` is the service locator. All usecases and services are instantiated there and shared as a singleton `inversify`. Pass it into components that need backend access.

**Usecases** — each feature has its own usecase class in `src/usecases/<domain>/`. Usecases call `inversify.graphqlService.send(...)` with raw GraphQL queries. They return a typed model from `model/` with a `message: CODES.*` discriminant.

**State management** — two Zustand stores:
- `contextStore` (persisted to `localStorage` as `vergo-storage`): user session, theme, volume
- `volatileStore` (in-memory only): transient UI state (fullscreen)

**Routing** — React Router v7. Two layout wrappers: `LayoutPublicExt` (unauthenticated) and `LayoutProtectedExt` (requires session). Routes defined in `src/App.tsx`.

**UI library** — `@happykiller/sunny-ui` provides `Login`, `Profile`, `CGU`, `NotFound`, `FlashMessage`, and several usecases/services (auth, passkey, session). MUI v7 is the base component library.

**i18n** — `react-i18next` with locale files at `src/locales/{en,fr}/translation.json`.
