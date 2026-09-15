# VELORA — Deployment Runbook

> This runbook covers building and deploying VELORA to production.

---

## Build command

```bash
npm run build
```

Produces an optimized, minified bundle in `build/`. The build is static — no server runtime required.

---

## Environment variables

| Variable | Required? | Purpose |
|----------|-----------|---------|
| *(none currently)* | — | VELORA is entirely client-side with `localStorage` persistence |

When a backend is added, the following will be needed:

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_API_URL` | `https://api.velora.app` | Backend API base URL |
| `REACT_APP_SENTRY_DSN` | `https://xxx@sentry.io/yyy` | Error reporting |

> **Never commit `.env` files.** Add them to `.gitignore` on day one.

---

## Hosting targets

### Option A — Vercel (recommended for React SPAs)

```bash
# Install Vercel CLI once
npm i -g vercel

# Deploy from project root
vercel --prod
```

Vercel auto-detects Create React App. Set **Output Directory** to `build` in project settings.

### Option B — Netlify

1. Connect the GitHub repo in Netlify dashboard.
2. Set **Build command:** `npm run build`
3. Set **Publish directory:** `build`
4. Add a `_redirects` file to `public/`:

```
/*  /index.html  200
```

This ensures client-side routing (React Router) works correctly on direct URL access.

### Option C — GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://toibawani.github.io/Velora",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Deploy:
```bash
npm run deploy
```

---

## Pre-deployment checklist

- [ ] `npm run build` exits with code 0 (no errors, only expected lint warnings)
- [ ] `npm test -- --watchAll=false` passes
- [ ] No hardcoded secrets or API keys in source
- [ ] `PUBLIC_URL` env var set if deploying to a sub-path
- [ ] Check bundle size — `build/static/js/main.*.js` should be < 150 kB gzipped

---

## Rollback steps

### Vercel

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote <deployment-url>
```

### Netlify

In **Netlify Dashboard → Deploys → select a previous deploy → Publish deploy**.

### GitHub Pages

```bash
# Revert the last commit on gh-pages branch
git checkout gh-pages
git revert HEAD
git push origin gh-pages
```

### Manual (any static host)

Keep the previous `build/` folder archived. Re-upload it to replace the current build.

---

## Post-deploy verification

1. Open the production URL in an incognito window.
2. Register a new account — confirm splash screen loads.
3. Navigate to Learn → Relativity Lab — confirm Canvas renders.
4. Check DevTools Console for JS errors.
5. Check Network tab — confirm no 404s on font files or chunk splits.
