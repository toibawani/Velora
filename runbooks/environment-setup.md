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

In your browser DevTools → Network tab, filter by `woff2`:

- `inter-latin-400-normal.woff2`
- `inter-latin-500-normal.woff2`
- `inter-latin-600-normal.woff2`
- `inter-latin-700-normal.woff2`
- `inter-latin-800-normal.woff2`
- `inter-latin-900-normal.woff2`

Each file is bundled through `@fontsource/inter` and should return **200** without contacting a third-party font CDN.

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
| Inter not rendering | Run `npm install` and confirm the six `inter-latin-*.woff2` requests return 200 in DevTools |
