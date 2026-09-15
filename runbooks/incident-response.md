# VELORA — Incident Response Runbook

> Operational procedures for diagnosing, containing, and resolving client-side runtime incidents in production.

---

## Severity Classifications

| Severity | Definition | Target Resolution | Examples |
|---|---|---|---|
| **SEV-1** (Critical) | Total app outage or infinite crash loops blocking all users | < 30 minutes | White screen on boot, unhandled syntax errors in production chunk, catastrophic Web Audio API loop freeze |
| **SEV-2** (High) | Core simulation or curriculum blocked | < 2 hours | Canvas context creation crash, broken simulation loop in RelativityLab or BlackHoleMastery, localStorage quota exceeded causing crash |
| **SEV-3** (Medium) | Degraded user experience or layout regression | < 1 business day | Responsive overflow on mobile, audio playback silent without error, incorrect metric calculation in Analytics |
| **SEV-4** (Low) | Minor aesthetic or copy imperfection | Scheduled release | Typos in lesson explanation, minor hover transition glitch |

---

## Triage & Incident Workflow

```
[Alert / User Report]
         │
         ▼
[1. Verify & Reproduce] ─── Check Sentry / DevTools Console in Incognito
         │
         ▼
[2. Assess Blast Radius] ─── Specific browser (Safari/Chrome), Web Audio / Canvas support, or universal
         │
         ▼
[3. Containment / Rollback] ─── Revert deployment on Vercel / Netlify dashboard (< 2 mins)
         │
         ▼
[4. Root Cause Fix] ─── Fix in hotfix branch -> run build -> verify
         │
         ▼
[5. Post-Mortem] ─── Document root cause, timeline, and regression tests
```

---

## Common Incident Scenarios & Runbook Actions

### 1. White Screen of Death (Chunk Load Failure or Uncaught React Error)
- **Symptoms:** Completely blank page; console shows `Loading chunk failed` or React component error boundary triggered.
- **Root Cause:** Stale client service worker or deployment of new hashes without cache invalidation on CDN.
- **Remedy:**
  1. Purge CDN edge cache (Vercel / Cloudflare).
  2. If caused by a code regression, trigger Instant Rollback to the previous deployment via hosting dashboard:
     - **Vercel:** Project -> Deployments -> Find previous deployment -> Promote to Production.
     - **Netlify:** Deploys -> Click previous deploy -> Publish deploy.

### 2. Canvas Context or WebGL / 2D Rendering Crashes
- **Symptoms:** Black hole simulation or relativity lab fails to render or crashes tab.
- **Diagnosis:**
  - Check browser console for `Lost WebGL context` or `Out of memory allocating canvas buffer`.
  - Verify device pixel ratio clamping (`Math.min(window.devicePixelRatio, 2)`).
- **Remedy:**
  1. Fallback card: Ensure the canvas failure triggers a graceful fallback (static SVG / diagram).
  2. Inspect animation loops: Verify all `requestAnimationFrame` IDs are cancelled on unmount in `useEffect`.

### 3. LocalStorage Corruption or Quota Exceeded
- **Symptoms:** Progress, streaks, or revisions fail to persist; `DOMException: QuotaExceededError`.
- **Diagnosis:** Inspect Application -> Storage -> Local Storage -> evaluate key sizes (especially whiteboard/sketchbook data).
- **Remedy:**
  1. Add error handling around `JSON.parse` and `localStorage.setItem` with fallback to memory state.
  2. Provide a recovery utility:
     ```js
     try {
       localStorage.setItem(key, value);
     } catch (e) {
       console.warn('LocalStorage quota exceeded, pruning cache', e);
       // Clean non-essential temporary caches
     }
     ```

### 4. Audio Context Suspended / Unhandled User Gesture Error
- **Symptoms:** Sound synthesizer errors in console (`AudioContext was not allowed to start`).
- **Remedy:** Ensure Web Audio API `AudioContext.resume()` is called strictly within a synchronous user click handler.

---

## Communication Template

```markdown
**INCIDENT NOTIFICATION — [SEV-LEVEL]**
- **Impacted Area:** [e.g., Relativity Lab canvas rendering]
- **Current Status:** [Investigating / Mitigating / Resolved]
- **Mitigation Action:** [e.g., Rolled back deployment to commit xxxxxxx]
- **Next Update In:** [e.g., 30 minutes]
```
