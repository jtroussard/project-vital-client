# PIN

## Purpose

This document is used to store initial development progress notes, last finished item, next task to complete, and any other ideas for future development.

## Next task to complete

- Implement prod version of the app, specifically the login page and verification.

## Last finished item

- Initial project setup
- Development environment setup
- Verified dev environment test user login

## Developer Handover Notes (AI Context)

> [!NOTE]
> Read this section first when resuming development to skip re-analysis.

### Current Architecture State
- **Frontend**: React (TS) + Vite + PrimeReact.
- **State Management**: **Zustand** (Store: `src/store/useAuthStore.ts`).
- **Styling**: TailwindCSS for layout, PrimeFlex for component-level spacing. 3-Section Flex Navbar (Left: Logo/Menu, Center: Title, Right: Auth).
- **Backend API**: Axios client in `src/services/apiClient.ts` with JWT interceptor.
- **Auth**: Supabase JS SDK (`src/services/supabaseClient.ts`).

### Pending Development (The "Prod" Push)
1. **Environment Setup**: Need to create `.env.production` with real production keys.
2. **Firebase Hosting**: Not yet initialized. Need `firebase init hosting`.
3. **Typography Polish**: Landing page hero text needs CSS layout refinement (currently stacked too vertically).
4. **API Integration**: Frontend is verified to login, but hasn't yet performed a full round-trip to the Cloud Run Java backend (needs CORS verification in prod).