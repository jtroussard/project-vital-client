# PIN

## Purpose

This document is used to store initial development progress notes, last finished item, next task to complete, and any other ideas for future development.


## On Deck
- **Expand User Settings**: Allow user to set the default metric form fields in their journal entrys. As well as providing a short cut by adding a checkbox on the form itself to update the defaults.

## Backlog
- **Add Vice Calendar**: Add a calendar page where users can track how many days their have gone without drinking, or smoking, etc. Future proof the implementation to fold in nicely with the goal tracking.
- **Add Journey Page**: Add a page that tracks their history with the app and their progress over time. Should mimic a employment or career timeline much like the one stack overflow used to generate for your profile. A vertical timeline with cards for each entry. This should also be able to incorporate the pictures uploaded of users to also track their visual progress (weight gain/loss whatever their goal)
- **Improve UI/UX on Dashboard**: Dashboard real estate is clunky; sizing, spacing, font size, all seem to be off and needs reimagining.
- **External Resource Providers**: Implement OAuth/OIDC registration and login flows for Google, Facebook, Apple, Garmin, Strava, and Apple Health.
- **Mobile Styling**: Apply mobile-first refinements to the Journal page tiles (single column layout).
- **Profile Avatars**: Enable user-selected avatars with backend storage.
- **Entry Detail Page Feature Updates**: Detail page should include an edit button that "opens" all data points inot form fields for editing. As well as a delete button for each metric (when edit is active) and a global delete button for the entire entry (edit mode agnostic, meaning it is always available).
- **Journal Entry History Summary Update**: If multiple entries of any type (metric/meal/note) are created on the same day, they should be grouped together. The summary tile should only show one day for each day there are any entries. On clicking the history card, opening the detail page should break down the entries for that day. The breakdown should be grouped by a "broad" time of day, not exact time. For example: Early Morning, Morning, Afternoon, Evening, Night. If the user enters a weighin at 6:30AM and a note at 7:00AM, they should be under the same "time of day tile". This time of day distinction does not appear on the summary tile.
- **Deployment Pipeline**: Solidify and document the CI/CD pipeline (GitHub Actions/Firebase) to ensure a stable, version-centric release strategy.
- **Goal Setting & Tracking**: Implement feature in the Profile/Settings to set health goals (e.g., target weight) and track progress on the dashboard.
- **Add Phase One Meal Tracking**: Add a page where users can track their meals. Phase one is just about getting a general and manual interface setup.
- **Add Phase Two Meal Tracking**: Add a page where users can track their meals. Phase two is about codifying the MACROS and calories and getting a general idea of the nutritional information of the food they are eating. Allow for saved meals and food items.
- **Add Phase Three Meal Tracking**: Add a page where users can track their meals. Phase three is about integrating with a food database to get nutritional information of the food they are eating. Allow for saved meals and food items.
- **Add Phase Four Meal Tracking**: Add a page where users can track their meals. Phase four is about having AI try to guage meal values from an uploaded photo and simple prompts from users, ex: "#3 meal at Thai Foon restaurant" or "Large bowl about 2 cups of home made cesear salad with grilled chicken and button top mushrooms".
- **Add Physical Activity Tracking**: Add a page where users can track their physical activity. This should include the ability to track the type of activity, duration, intensity, and calories burned. This should also include the ability to track the type of activity, duration, intensity, and calories burned.
- **Add integrations for Garmin watches**: Add the ability to integrate with Garmin watches to pull in physical activity data.
- **Add The Minder Feature**: Basically and AI that runs every week and analzyses your journal entries and provides insights and suggestions.


### Bugs
- Note field is not being saved. Probably a backend issue. [FIXED]
- Main page navigation hamburger button always visiable. Should only be visiable to authenticated users.
- Immediately after saving the user setting for preferred unit system, the selector option reloads and shows the top option. Only after refreshing the page does the saved option show up. It could be confusing to the user, find a way to update the state on the UI to reflect the change immediately.

## Last finished item
- **Dashboard Enhancements**: Implement data visualization using Chart.js or similar to display metric trends (Weight, Blood Pressure, etc.) from gathered journal data.
- **Journal Relational Batching**: Implemented parent-child model for metric entries (Blood Pressure, etc.).
- **Server-Side Pagination**: Added paginated history feed with "Load More" functionality (8 entries per page).
- **Standardized Measurements**: Implemented backend-driven unit conversion (Metric/Imperial) and `displayValue`/`displayUnit` support.
- **Journal Details Page**: Created high-detail read-only view for individual entry batches.
- **Form Refactoring**: Modularized `JournalForm` and extracted `MetricEntryRow` for better consistency and performance.
- **Registration Workflow**: Implement comprehensive sign-up, email verification, and "forgot password" flows using Supabase Auth.


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