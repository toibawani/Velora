# VELORA — Environment Setup

> **Goal:** Clone the repo and have VELORA running locally in under 5 minutes.

---

## Prerequisites

| Tool | Minimum version | Check |
|------|----------------|-------|
| Node.js | 18.x LTS or 20.x LTS | `node -v` |
| npm | 9.x+ | `npm -v` |
| Git | any recent | `git --version` |

> **macOS users:** Install Node via [nvm](https://github.com/nvm-sh/nvm) — `nvm install 20 && nvm use 20`. Avoids permission issues with global packages.

---

## 1. Clone the repository

```bash
git clone https://github.com/toibawani/Velora.git
cd Velora
```

---

## 2. Install dependencies

```bash
npm install
```

Expected time: ~30–60 seconds on first install (downloads ~1 300 packages).

> If you see audit warnings, they are from transitive React Scripts dependencies — not VELORA code. Do **not** run `npm audit fix --force`; it will break React Scripts.

---

## 3. Environment variables

VELORA currently has **no server-side secrets**. All data is stored in `localStorage`. No `.env` file is needed to run locally.

When/if a backend is added, a `.env.local` file will be required (see `deployment.md`).

---

## 4. Start the development server

```bash
npm start
```

The app opens at **http://localhost:3000** automatically. Hot module reload is active — changes to JSX/CSS reflect instantly without a full page refresh.

---

## 5. Verify fonts load correctly

In your browser DevTools → Network tab → filter by `woff2`:

- `GeneralSans-Regular.woff2` — should return **200** (served locally from `src/fonts/`)
- `GeneralSans-Medium.woff2` — should return **200** (served locally)
- `Plus+Jakarta+Sans` — loaded from Google Fonts CDN (requires network)

If Plus Jakarta Sans fails to load (offline), the UI falls back gracefully to General Sans at every weight.

---

## 6. Run the test suite

```bash
npm test -- --watchAll=false
```

Expected: `PASS src/App.test.js` — 1 suite, 1 test.

---

## 7. Create a production build locally

```bash
npm run build
```

Output: `build/` folder. Serve locally with:

```bash
npx serve -s build
```

Access at **http://localhost:3000**.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ENOENT: no such file or directory, open 'node_modules/...'` | Run `npm install` again |
| Port 3000 in use | `npm start` will auto-prompt for port 3001 — say Yes |
| Blank white screen | Check browser console for missing import; most likely a renamed/deleted CSS file |
| `react-scripts: command not found` | `node_modules/.bin` not in PATH — run `npx react-scripts start` instead |
| General Sans not rendering | Font files in `src/fonts/` must be committed — check with `git ls-files src/fonts/` |
