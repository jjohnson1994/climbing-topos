# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless full-stack climbing topos application built with SST (Serverless Stack) on AWS. The application allows users to discover climbing areas (crags), browse routes, log climbs, create lists, and search climbing locations worldwide. It uses Next.js 14 for the frontend, AWS Lambda for the backend, DynamoDB for data storage, and Algolia for search.

## Development Commands

### Running the Application

```bash
# Start SST development mode (auto-starts Next.js dev server)
npx sst dev

# The Next.js app runs on http://localhost:3000 (configured with autostart in sst.config.ts)
```

### Building

```bash
# Build the Next.js app
cd packages/app && npm run build

# Build shared type packages
cd packages/types && npm run build
cd packages/globals && npm run build
cd packages/schemas && npm run build
```

### Linting & Formatting

```bash
# Run ESLint across the project
npx eslint .

# Format code with Prettier
npx prettier --write .
```

### Git Hooks

This project uses Husky with lint-staged. Pre-commit hooks automatically run:
- ESLint on modified JS/TS files
- Prettier formatting
- TypeScript type checking with `tsc-files --noEmit`

## Architecture

### Monorepo Structure

This is a pnpm workspaces monorepo with the following packages:

- **packages/app** - Next.js 14 frontend (SSR + server actions)
- **packages/api** - Lambda handlers and backend logic
- **packages/types** - Shared TypeScript type definitions
- **packages/schemas** - Yup validation schemas (shared between frontend and backend)
- **packages/globals** - Constants (grading systems, tags, rock types)
- **infra/** - SST infrastructure definitions

### Backend Architecture

The API follows a layered architecture:

```
API Routes (packages/api/routes/)
    ↓
Services (packages/api/services/)  ← Business logic, data aggregation
    ↓
Models (packages/api/models/)      ← DynamoDB operations, data marshalling
    ↓
DynamoDB
```

**Key directories in packages/api:**
- `routes/` - Lambda handlers for REST endpoints (get/post/patch/delete)
- `services/` - Business logic that aggregates data from multiple models
- `models/` - Direct DynamoDB operations using AWS SDK
- `events/` - Event-driven handlers (DynamoDB streams → SNS → Algolia indexing)
- `db/` - Client utilities (DynamoDB, Algolia, SNS, SES)
- `utils/` - Authentication and validation helpers
- `auth.ts` - OpenAuth issuer configuration

### Database Design

**Single-table DynamoDB design** (`climbingtopos2` table):

- **Primary Key**: `hk` (partition) + `sk` (sort)
- **GSI1**: `model` (partition) + `sk` (sort) - Query all entities of a type
- **GSI2**: `model` (partition) + `slug` (sort) - Direct lookup by slug

**Entity patterns:**
- Users: `hk=user-{id}`, `sk=metadata#`
- Crags: `hk={slug}`, `sk=metadata#`, `model=crag`
- Areas: `hk={slug}`, `sk=metadata#`, `model=area`
- Routes: `hk={slug}`, `sk=metadata#`, `model=route`
- Logs: `hk=log-{id}`, `sk=metadata#`, `model=log`
- Lists: `hk=list-{slug}`, `sk=metadata#`, `model=list`

**DynamoDB Stream** enabled with NewAndOldImages for event-driven architecture.

### Event-Driven Architecture

Changes to DynamoDB trigger a stream handler that publishes to SNS topics based on entity type and operation:

```
DynamoDB Stream
    ↓
packages/api/events/dynamodb/stream.ts (routes to appropriate SNS topic)
    ↓
SNS Topics (per entity: area, crag, route, topo, log × onInsert/onModify/onRemove)
    ↓
Lambda Subscribers (packages/api/events/{entity}/)
    ↓
Side effects: Algolia indexing, denormalized count updates
```

### Authentication System

Uses **OpenAuth** (from `@openauthjs/openauth`) with custom JWT tokens:

1. Auth domain: `auth.climbingtopos.com` (or stage-specific in dev)
2. Two providers: **code** (email login code) and **password** (signup with password + email verification)
3. Backend handler: `packages/api/auth.ts`
4. JWT tokens (RS256) stored in httpOnly cookies: `access_token`
5. Token payload includes: `{ email, status, nickname?, picture? }`
6. Middleware protection in `packages/app/middleware.ts`:
   - Checks `status=pending` → redirect to `/signup-confirm`
   - Checks `picture` presence → if missing, redirect to `/first-login`

**User flow:**
- New users sign up → status='pending' → must verify email
- After verification → redirected to `/first-login` for profile setup
- Profile complete → `picture` field populated → full access

### Search Integration

**Algolia** powers all search and discovery:
- Frontend: React InstantSearch components (`packages/app/app/explore/`)
- Backend: Algolia client in `packages/api/db/algolia.ts`
- Indexed entities: crags, areas, routes
- Facets: grade, rock type, tags, location, rating
- Indexing triggered by DynamoDB stream events

### Shared Libraries Pattern

**Type Safety:**
- Define TypeScript interfaces once in `packages/types`
- Import in both frontend and backend
- Prevents type mismatches

**Validation:**
- Yup schemas in `packages/schemas`
- Used in API routes for request validation
- Used in frontend forms via `@hookform/resolvers`

**Constants:**
- `packages/globals` exports grading systems, tags, rock types
- Ensures UI dropdowns match API validations
- Single source of truth

## Infrastructure (SST)

Infrastructure is defined in `sst.config.ts` and `infra/` directory:

- **auth.ts** - OpenAuth configuration with Email provider
- **dynamo.ts** - Single DynamoDB table with GSI1/GSI2
- **storage.ts** - S3 bucket for climbing photos (`climbingtopos2Images`)
- **email.ts** - SES email service for auth emails
- **sns.ts** - 16 SNS topics for entity lifecycle events
- **secrets.ts** - Algolia, PostHog, JWT keys (Config.Secret for sensitive values)

**Resource linking** in `sst.config.ts`:
- Frontend has access to `Resource.Auth`, `Resource.Table`, `Resource.Bucket`, etc.
- SST generates type definitions in `sst-env.d.ts`

## Common Patterns

### Adding a New API Endpoint

1. Create handler in `packages/api/routes/{entity}/{method}.ts`
2. Validate request body with schema from `packages/schemas`
3. Call service method from `packages/api/services/{entity}.ts`
4. Service calls model method from `packages/api/models/{entity}.ts`
5. Model performs DynamoDB operation
6. DynamoDB stream triggers SNS event → Algolia indexing (if applicable)

### Adding a New Entity Type

1. Define TypeScript interface in `packages/types`
2. Create Yup validation schema in `packages/schemas`
3. Create model in `packages/api/models/{entity}.ts`
4. Create service in `packages/api/services/{entity}.ts`
5. Create API routes in `packages/api/routes/{entity}/`
6. Add SNS topics in `infra/sns.ts` (onInsert/onModify/onRemove)
7. Create event handlers in `packages/api/events/{entity}/`
8. Update `packages/api/events/dynamodb/stream.ts` to route new entity type

### Working with Forms

1. Import schema from `@climbingtopos/schemas`
2. Use `react-hook-form` with `@hookform/resolvers/yup`
3. Submit via server action that calls API route
4. Display errors with SweetAlert2

## Key Technologies

- **Frontend**: Next.js 14, React 18, Bulma CSS, React Hook Form, Leaflet (maps)
- **Backend**: Hono (routing framework), AWS Lambda, DynamoDB, S3, SES, SNS
- **Auth**: OpenAuth, JWT (RS256), bcrypt
- **Search**: Algolia, React InstantSearch
- **Analytics**: PostHog
- **Validation**: Yup, Valibot
- **Infrastructure**: SST v3, AWS (eu-west-1)

## Data Model Entities

- **Crag** - A climbing location (e.g., "Stanage Edge")
- **Area** - A sub-section of a crag (e.g., "High Neb")
- **Route** - A climbing route with grade, type, description
- **Topo** - A photo/diagram showing route lines
- **Log** - User's climbing attempt record (date, grade, rating)
- **List** - User-curated collection of routes

## Grading Systems

The app supports 8 climbing grading systems (defined in `packages/globals`):
- Font (bouldering)
- British Technical, British Adjectival
- French Sport
- Hueco (V-scale)
- UIAA
- YDS (Yosemite Decimal System)
- Australian/Ewbank

Route types: boulder, sport, trad, aid, alpine, mixed

## Current State (Auth Branch)

The repository is on the `auth` branch with recent authentication system changes:
- Migration from previous auth to OpenAuth + custom JWT
- Password-based login implementation
- Email verification flow for new signups
- JWT token generation using RS256 keys
- Modified files: `packages/app/app/login/page.tsx`

## Notes

- The SST dev environment automatically starts the Next.js dev server (configured with `dev.autostart: true`)
- Secrets are managed via SST Config.Secret (not committed to git)
- The main branch for PRs is `main`
- AWS region: eu-west-1
- Production stage uses `removal: 'retain'` policy to prevent accidental deletions
