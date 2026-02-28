# PIN

## Purpose

This document is used to store initial development progress notes, last finished item, next task to complete, and any other ideas for future development.

## Immediate Next task to complete

- **Dashboard Enhancements**: Implement data visualization using Chart.js or similar to display metric trends (Weight, Blood Pressure, etc.) from gathered journal data.
- **Goal Setting & Tracking**: Implement feature in the Profile/Settings to set health goals (e.g., target weight) and track progress on the dashboard.
- **Registration Workflow**: Implement comprehensive sign-up, email verification, and "forgot password" flows using Supabase Auth.
- **Deployment Pipeline**: Solidify and document the CI/CD pipeline (GitHub Actions/Firebase) to ensure a stable, version-centric release strategy.

## Backlog

- **External Resource Providers**: Implement OAuth/OIDC registration and login flows for Google, Facebook, Apple, Garmin, Strava, and Apple Health.
- **Mobile Styling**: Apply mobile-first refinements to the Journal page tiles (single column layout).
- **Profile Avatars**: Enable user-selected avatars with backend storage.

### Bugs
- Note field is not being saved. Probably a backend issue. [FIXED]

## Last finished item

- **Journal Relational Batching**: Implemented parent-child model for metric entries (Blood Pressure, etc.).
- **Server-Side Pagination**: Added paginated history feed with "Load More" functionality (8 entries per page).
- **Standardized Measurements**: Implemented backend-driven unit conversion (Metric/Imperial) and `displayValue`/`displayUnit` support.
- **Journal Details Page**: Created high-detail read-only view for individual entry batches.
- **Form Refactoring**: Modularized `JournalForm` and extracted `MetricEntryRow` for better consistency and performance.

## MVP Definition (Launch Criteria)

To officially launch and move to a version-centric release strategy, the following must be stable:
1. **Core Journaling**: Batching, metrics, and paginated history complete and verified. [DONE]
2. **Dashboard**: At least 2-3 key metric charts (e.g., Weight trend, BP trend).
3. **Identity**: Full registration, login, and recovery flows (Standard + at least 1 Social Provider).
4. **Goals**: Ability to set a target and see a "progress to goal" indicator.
5. **DevOps**: Automated deployment to production on merge to `main`.

## Developer Handover Notes (AI Context)

### Current Architecture State
- **Frontend**: React (TS) + Vite + PrimeReact. Deployed to Firebase Hosting.
- **State Management**: Zustand (Auth: `useAuthStore.ts`, Settings: `useSettingsStore.ts`).
- **Styling**: TailwindCSS (layout) + PrimeFlex (spacing). PrimeReact `p-card-tight` for density.
- **Backend API**: Axios + JWT Interceptor. Paginated endpoints supported (`Page<T>`).
- **Data Model**: Parent `JournalBatch` with child `JournalEntryResponse`. Measurements stored in base units, converted via `displayValue`.

### Pick Up Where We Left Off
We just completed the **Journal Pagination & Batching** refactor. The frontend is now lean, with history logic moved into the `RecentActivityCard`. The next logical focus is **Dashboard Visualization** to make the recorded data meaningful to the user.