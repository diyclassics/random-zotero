# Random Zotero v1 — design

Brainstormed 2026-05-04. Implementation iterates from this baseline; sections
3–5 (data flow, quality gates, engineering hygiene) intentionally deferred to
in-code decisions during the build.

## Locked-in scope (Q1–Q5)

| # | Question | Decision |
|---|---|---|
| 1 | Stack direction | Vanilla TypeScript + minimal build step. **No framework.** Priorities = UX polish (B) + platform quality gates (C), with a thin slice of modern stack (A). |
| 2 | Audience | **Showcase / portfolio piece.** First-paint polish, OG share card, "feels classy." Repeat-use features (next button, deep links, keyboard, copy citation) intentionally dropped. |
| 3 | Aesthetic | **Minimalist Swiss / typographic.** Sans-serif, strict grid, restrained color (ink + one accent), generous whitespace. |
| 4 | Type | **Inter Variable, self-hosted**, subset to Latin + Zotero MLA punctuation, ~40KB woff2, `font-display: swap`, preloaded. |
| 5 | Reroll | **One understated affordance** (small button, no full reload). |

## Section 1 — architecture & build

- TypeScript strict, bundled with **Vite**. Entry `src/main.ts`, modules
  `src/zotero.ts` (API adapter), `src/render.ts` (DOM update),
  `src/styles.css`, plus `index.html`. Target ~150 lines of TS.
- Vite chosen over plain `tsc` for: dev server with HMR, native TS, PostCSS
  (autoprefixer), asset hashing, `<link rel="preload">` injection for the
  font. `base: '/random-zotero/'` for project-pages URL.
- No framework. No Bootstrap. All styling hand-written CSS with custom
  properties + a small grid.
- Self-hosted assets only. Inter Variable woff2 in `/public/fonts/`. No CDNs.
- Deploy via `.github/workflows/deploy.yml` → `actions/deploy-pages@v4`.
  Pages source switches from "branch" to "GitHub Actions." `main` stays free
  of build artifacts.
- History anchors: `v0.1-flask` (Python era), `v0.2-vanilla` (no-build static),
  `v1.0` (this rewrite).

## Section 2 — layout, type, color, reroll

- **Grid.** Single column, max content width `34rem` (~62ch). Centered
  horizontally; vertically positioned at ~22vh on desktop, ~12vh on mobile so
  the citation lands in the optical upper third. Vertical rhythm on a 4px
  baseline.
- **Type.** Inter Variable, three roles:
  - eyebrow `RANDOM ZOTERO` — `0.75rem`, `letter-spacing: 0.08em`
  - citation body — `1.125rem`, `line-height: 1.55`, weight 400; italics
    inherit from Inter for MLA titles
  - micro footer — `0.8125rem`, weight 400, muted
- **Color.** Two CSS custom properties + one accent.
  - light: `--ink: #111`, `--paper: #fafaf7`
  - dark (auto via `prefers-color-scheme`): `--ink: #ededea`, `--paper: #0f0f10`
  - `--accent` used only for linkout icon hover and reroll affordance.
  - No toggle — system preference is the contract.
- **Reroll.** Bottom-right fixed `button`, label `Another` with a `↻` glyph.
  `border: 1px solid currentColor; border-radius: 999px;`. On click: fetch +
  200ms cross-fade on the citation. Disabled while in-flight, with
  `aria-busy="true"` on the citation region. Keyboard-reachable. No keyboard
  shortcut.
- **No card chrome.** Just type on paper.

## Sections 3–5 (deferred, decide in code)

- **Data flow / error handling.** Same two-call Zotero pattern as v0.2
  (count → random offset → MLA bib HTML), ported to TS with proper types and
  a real error UI.
- **Quality gates.** Semantic HTML, OG/meta tags, CSP, Lighthouse pass — wire
  in once layout is real.
- **Engineering hygiene.** GitHub Actions deploy workflow. Tests deferred
  unless something specifically warrants them (this app has ~one branchy
  function: the Zotero adapter).

## Build loops

1. Vite + TS scaffold, port v0.2 fetch logic 1:1, GH Actions deploy, switch
   Pages source to Actions. **Goal: same site, modern stack, live.**
2. Inter Variable + Swiss layout + color tokens + light/dark mode.
3. Reroll affordance, cross-fade, error UI, loading state.
4. Semantic HTML / a11y / OG meta / CSP / Lighthouse pass.

Each loop ends with a deploy and a look-at-it pause.
