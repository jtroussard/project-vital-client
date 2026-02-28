# Project Vital: Client

Project Vital is a modern, responsive web application designed as a personal health journal and dashboard. It allows users to track daily health metrics, manage their profiles, and visualize their wellness journey.

## Features
- **Health Journal**: Multi-metric cascading selection for logging vitals (e.g., Weight, Blood Pressure, Glucose).
- **Relational Batching**: Entries recorded together are visually and logically grouped.
- **Dynamic Dashboard**: Snapshot summary of health data.
- **Unit Preferences**: Support for both Metric and Imperial systems with server-side conversions.
- **Responsive Design**: Built with a mobile-first philosophy using PrimeReact and Tailwind CSS.
- **Secure Auth**: Integrated with Supabase for robust user authentication.

## Development Setup

### 1. Prerequisites
- **Node.js**: (v18+ recommended)
- **Firebase CLI**: `npm install -g firebase-tools` (for deployment)

### 2. Workspace Configuration
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Create a `.env.local` file based on `.env.template`:
   ```bash
   cp .env.template .env.local
   ```
   Fill in your **Supabase** keys and **Gateway API** URL:
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
   - `VITE_API_URL`: URL of the Project Vital backend API.

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## Development Workflow

| Command | Description | Target Environment |
| :--- | :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR. | Local (`localhost:5173`) |
| `npm run build` | Compiles TS and bundles assets for production. | Production (`dist/`) |
| `npm run deploy-prod` | Builds the app and deploys to Firebase. | Production (Firebase) |
| `npm run preview` | Locally previews the production build. | Local |
| `npm run lint` | Runs ESLint to check for code quality and style issues. | N/A |

### Versioning & Releases
We follow a version-centric release strategy. Ensure all major features are verified in the local workspace before merging to `main`. Merges to `main` are the primary trigger for production deployment preparation.

## Deployment

### Production Deploy (Firebase)
We deploy the frontend to **Firebase Hosting**.

1. **Automated Deploy**:
   ```bash
   npm run deploy-prod
   ```
   *This command runs `npm run build` first and only proceeds to `firebase deploy` if the build is successful.*
   *Alternative: Use the `/deploy-frontend` workflow if available in your agentic environment.*

**Production URL**: [https://project-vital-client-prod.web.app](https://project-vital-client-prod.web.app)

## Tech Stack
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **UI Components**: PrimeReact
- **Styling**: Tailwind CSS & PrimeFlex
- **State Management**: Zustand
- **Backend Communication**: Axios
- **Authentication**: Supabase Auth
- **Hosting**: Firebase Hosting
