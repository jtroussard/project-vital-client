---
description: Deploy the frontend to Firebase Hosting (production)
---

## Prerequisites
- You are authenticated with Firebase CLI (`firebase login`)
- `.env.production` is configured with correct Supabase and Cloud Run URLs
- All local changes are committed and tested locally

## Steps

1. Navigate to the frontend project root
```
cd /Users/jtroussard/Projects/project-vital-client
```

2. Install dependencies (if needed)
```
npm install
```

// turbo
3. Build for production (uses `.env.production` automatically)
```
npm run build
```

4. Deploy to Firebase Hosting
```
firebase deploy --only hosting --project project-vital-client-prod
```

5. Verify the deployment at the live URL:
```
https://project-vital-client-prod.web.app
```
