# Vercel Deployment Guide - Fix 404 on Page Refresh

## Problem
When deploying a React SPA (Single Page Application) with React Router to Vercel, refreshing the page on any route other than the root (`/`) causes a 404 error. This happens because Vercel tries to find the file on the server, but client-side routes don't exist as actual files.

## Solution
We've added two configuration files to fix this issue:

### 1. `vercel.json` (Primary Solution)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**What it does:**
- Tells Vercel to rewrite all routes to serve `index.html`
- React Router then handles the routing on the client side
- Works for all routes including nested routes like `/dashboard/categories/123`

### 2. `public/_redirects` (Backup Solution)
```
/*    /index.html   200
```

**What it does:**
- Alternative configuration that some hosting platforms use
- Provides fallback support
- Returns 200 status code (not 301/302 redirect)

## Deployment Steps

### Step 1: Commit Changes
```bash
git add vercel.json public/_redirects
git commit -m "fix: Add Vercel configuration for SPA routing"
git push origin main
```

### Step 2: Deploy to Vercel
Vercel will automatically detect the changes and redeploy.

**Or manually trigger deployment:**
```bash
vercel --prod
```

### Step 3: Verify
After deployment, test these scenarios:
1. ✅ Navigate to `/dashboard` - should work
2. ✅ Refresh the page - should NOT show 404
3. ✅ Navigate to `/dashboard/categories/create` - should work
4. ✅ Refresh the page - should NOT show 404
5. ✅ Navigate to any nested route and refresh - should work

## How It Works

### Before (Without Configuration)
```
User visits: https://yourapp.vercel.app/dashboard/categories
↓
Vercel looks for: /dashboard/categories/index.html
↓
File not found → 404 Error ❌
```

### After (With Configuration)
```
User visits: https://yourapp.vercel.app/dashboard/categories
↓
Vercel rewrites to: /index.html
↓
React app loads → React Router handles /dashboard/categories
↓
Correct page displays ✅
```

## Alternative Solutions (If Above Doesn't Work)

### Option 1: Update vercel.json with routes
```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Option 2: Add to vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Option 3: Use Vercel CLI Configuration
```bash
vercel --prod --build-env VITE_ROUTER_MODE=history
```

## Vercel Dashboard Configuration

If the above doesn't work, you can also configure in Vercel Dashboard:

1. Go to your project on Vercel
2. Click **Settings**
3. Go to **Rewrites and Redirects**
4. Add a new rewrite:
   - **Source**: `/(.*)`
   - **Destination**: `/index.html`
   - **Type**: Rewrite (not Redirect)

## Common Issues & Solutions

### Issue 1: Still Getting 404
**Solution:** Clear Vercel cache and redeploy
```bash
vercel --prod --force
```

### Issue 2: API Routes Not Working
**Solution:** Update vercel.json to exclude API routes
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue 3: Static Assets Not Loading
**Solution:** Ensure static assets are in the `public` folder and referenced correctly
```tsx
// ✅ Correct
<img src="/logo.png" alt="Logo" />

// ❌ Wrong
<img src="logo.png" alt="Logo" />
```

### Issue 4: Environment Variables Not Working
**Solution:** Add environment variables in Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add your variables (e.g., `VITE_API_URL`)
3. Redeploy

## Build Configuration

### Vercel Build Settings
Make sure these are set in your Vercel project:

- **Framework Preset**: Vite
- **Build Command**: `pnpm run build` or `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install` or `npm install`

### package.json Scripts
Ensure you have these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## Testing Locally

### Test with Vite Preview
```bash
pnpm run build
pnpm run preview
```

Then test:
1. Navigate to different routes
2. Refresh the page
3. Should work without 404 errors

### Test with Vercel CLI
```bash
vercel dev
```

This simulates the Vercel environment locally.

## Additional Notes

### React Router Configuration
Make sure you're using `BrowserRouter` (not `HashRouter`):

```tsx
// ✅ Correct
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* routes */}
    </BrowserRouter>
  );
}
```

### Base URL Configuration
If deploying to a subdirectory, update `vite.config.ts`:

```ts
export default defineConfig({
  base: '/subdirectory/', // if deploying to example.com/subdirectory
  // ... rest of config
});
```

## Verification Checklist

After deployment, verify:
- [ ] Root route (`/`) works
- [ ] Dashboard route (`/dashboard`) works
- [ ] Nested routes work (`/dashboard/categories/123`)
- [ ] Page refresh doesn't cause 404
- [ ] Browser back/forward buttons work
- [ ] Direct URL access works
- [ ] Static assets load correctly
- [ ] API calls work (if applicable)

## Support

If you still encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify `vercel.json` is in the root directory
4. Ensure `_redirects` is in the `public` folder
5. Try clearing Vercel cache: `vercel --prod --force`

## Summary

✅ **Files Added:**
- `vercel.json` - Main configuration for Vercel
- `public/_redirects` - Backup configuration

✅ **What's Fixed:**
- 404 errors on page refresh
- Direct URL access to any route
- Browser back/forward navigation
- Bookmarked URLs

✅ **Next Steps:**
1. Commit and push changes
2. Vercel will auto-deploy
3. Test all routes with refresh
4. Enjoy your working SPA! 🎉
