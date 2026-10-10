# VELORA Design System

Single source of truth for the visual language. Every component should reference these
roles (`surface`, `text`, `accent`, `border`, `status`) — never a raw hex — so both
themes stay correct without touching feature CSS.

## Token map

### Color

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| `--color-bg` | `#F7F2E9` | `#171009` | Page canvas |
| `--color-text` | `#241B13` | `#F0E4D6` | Primary text |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | from `--color-text` | muted | Content hierarchy |
| `--color-border` / `--border-default` | `rgba(50,30,20,.14)` | `rgba(50,30,20,.24)` | Dividers, inputs |
| `--accent-primary` | `#A34A22` | `#E0A96A` | Primary actions |
| `--color-success` / `--color-warning` / `--color-error` / `--color-info` | statuses | statuses | Status labels |
| `--subject-*` | 9 subject hues | same | Topic/subject identity |
| `--bg-glass` / `--bg-glass-strong` | frosted surfaces | darker frosted | Modals, overlays |
| `--accent-soft` / `--accent-line` / `--accent-shadow` | 0.08 / 0.4 / 0.2 | same | Shadows, lines |
| `--ring` | `#A34A22` | same | Focus ring |

### Status

| Role | Token | Light | Dark |
|------|-------|-------|------|
| Success | `--color-success` | `#2F6B41` | `#3E7D51` |
| Warning | `--color-warning` | `#8A5A10` | `#9A6B1A` |
| Error | `--color-error` | `#B4322A` | `#932723` |
| Info | `--color-info` | `#1F6F8C` | `#3A8FA0` |

### Subject hues (9)

`physics`, `chemistry`, `biology`, `philosophy`, `history`, `political-science`,
`mathematics`, `psychology`, `economics` — see `:root` in `design-tokens.css`.

### Typography

Three roles, chosen deliberately. This is the pairing, and why it is this one:

| Role | Font | Fallback |
|------|------|----------|
| `--font-display` | Fraunces (serif, optical-size axis) | Georgia, Times New Roman, serif |
| `--font-reading` / `--font-body` | Source Serif 4 | Georgia, serif |
| `--font-sans` / `--font-ui` | Source Sans 3 | -apple-system, Segoe UI, sans-serif |
| `--font-mono` | SF Mono, JetBrains Mono, Fira Code | Consolas, monospace |

Fraunces is the display face because it has real weight contrast and an
optical-size axis, so a 5rem hero and a 1.25rem card heading read as the same
voice rather than one stretched and one shrunk. Source Serif 4 is the
long-form body: this is a reading product, and a serif at 17px is what
sustains a twenty-minute lesson. Source Sans 3 is the chrome only - nav,
buttons, status tags, form fields - so the interface never competes with the
prose. That is the whole system: one display, one reading face, one UI face.
The previous states were "Inter everywhere" (declared but never even loaded)
and Fraunces paired with the sans as body, which set long lessons in the
nav's typeface at a large size.

### Spacing (4/8px grid)

`--space-1` … `--space-16` (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px). No creative
`gap`/`padding` values; use the scale for consistency. `scripts/tokenizeSpacing.js`
snaps stragglers onto the scale and is idempotent, so re-running it after a
manual edit shows what drifted.

### Radius

`--radius-xs/sm/md/lg/xl/2xl/3xl/full` (3, 6, 8, 12, 18, 24, 32, 999px). Two
steps were added when the audit found 135 raw radii - the old ladder ended at
18px while hero panels were drawn at 20-32px.

### Shadows

`--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-hover`.

## Usage rules

1. **Never** use a raw hex in a component. Use the token roles.
2. **Never** re-declare a token in a feature file; replace with the role.
3. **Never** use Tailwind classes for colors; the CSS variables are the system.
4. **Always** test both themes when changing a color.
5. **Keep** `design-tokens.css` as the only source of truth.

## Example

```css
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--accent-contrast);
  border: 1px solid var(--accent-line);
}
```
