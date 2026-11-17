# Fitness Tracker

Personal workout tracker PWA. Single user (me, Tristen). Runs on my iPhone as a home screen web app served from GitHub Pages at https://tristencasey-cloud.github.io/fitness-tracker/. No backend, no accounts. This app is workouts only. Diet and nutrition are a separate future app, so never add food, calorie, or macro features here.

I'm an IT student learning React and TypeScript. Explain non-obvious decisions briefly. Don't explain basic programming.

## Stack
- Vite + React + TypeScript (strict)
- React Router (HashRouter, because GitHub Pages has no server-side routing)
- Dexie + dexie-react-hooks (IndexedDB)
- vite-plugin-pwa (offline, update prompt)
- Hand-written CSS with design tokens in src/styles/tokens.css (no Tailwind, no UI kits)
- @phosphor-icons/react (bold and fill weights only)
- Exercise library generated from yuhonas/free-exercise-db (public domain) by scripts/, committed to src/db/seed/
- Custom SVG charts (no chart library)
- Vitest for logic tests
- GitHub Actions deploys to Pages on every push to main

## Commands
- `npm run dev`: local dev server
- `npm run dev -- --host`: dev server reachable from my iPhone on the same Wi-Fi (UI only; service worker features need the deployed HTTPS site)
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`

## Rules
- TypeScript strict. No `any`.
- All database access goes through src/db/. Components never touch Dexie tables directly.
- Dexie schema changes: never edit an existing version. Add a new version with an upgrade function, and bump the export schemaVersion.
- Storage names: database `fitness-tracker-db`, localStorage keys prefixed `ft:`. This app shares an origin with my old app at /healthapp/, so unprefixed keys can collide.
- Must work fully offline. No runtime network requests, no CDN fonts or scripts.
- Data never leaves the device except through export.
- Pure logic lives in src/lib/ with tests. Run typecheck and tests before saying anything is done.
- Ask before adding a dependency that isn't in the stack list.
- Library APIs change between versions (React Router, Dexie, vite-plugin-pwa especially). If you're not sure of the current API, check the current docs (with Context7 if it's set up) before writing code.
- Keep commits small and focused.

## iPhone rules
- Respect safe areas with env(safe-area-inset-*).
- Inputs at least 16px font-size (prevents iOS auto-zoom). Use inputmode for number keyboards.
- Touch targets at least 48px. Primary actions within thumb reach at the bottom of the screen.
- No hover-only interactions.
- No Vibration API (iOS doesn't support it). Feedback comes from visuals and motion.
- Respect prefers-reduced-motion.
- Timers are computed from stored timestamps, never from a running interval, because iOS suspends backgrounded web apps.

## Domain definitions
- Warm-up sets never count toward top sets, PRs, volume, or charts.
- Top working set: the heaviest non-warm-up set. Ties go to the set with more reps.
- PR: a working set heavier than any previous working set for that exercise, OR more reps than ever before at a given weight. For bodyweight exercises, weight means added weight (0 = bodyweight only).
- Volume: sum of weight x reps across working sets.
- Next up: the routine after the most recently finished workout's routine in the active split. Wraps around at the end. If there's no history, it's the first routine.

## Design
Direction: loud and bold. Dark base, huge heavy type, and numbers are the hero (weights and reps should be the biggest things on screen). Two strong accent colors used in solid blocks. Confident, snappy motion. Big visual moments for PRs and finishing a workout.
Voice: almost none. Short, plain labels. No jokes, hype copy, or motivational text.
Avoid: purple/blue gradients, Inter/Roboto/default system-font look, glassmorphism, emoji as icons, generic rounded card grids, tiny gray text.
Colors, fonts, spacing, and motion come only from tokens.css. No hardcoded values in components.

## Roadmap
- Phase 1 (current): Steps 0-5 in docs/starting-prompt.md
- Phase 2: RPE, per-set notes, supersets, plate calculator (uses bar and plate settings)
- Phase 3: per-exercise progress screen (every set, every session), top working set chart, PR alerts, workout calendar
- Phase 4: cardio logging, body weight log with trend chart
- Later: polish pass

## Status
Update this after every step: what's done, what's next, known issues.
- [x] Step 0: Environment and repo
- [ ] Step 1: Scaffold, deploy, iPhone install (code done and pushed; waiting on Pages setup and the iPhone install check)
- [ ] Step 2: Data layer
- [ ] Step 3: Library, routines, splits
- [ ] Step 4: Workout logging
- [ ] Step 5: History and backup

Next: finish Step 1 checks on the iPhone, then Step 2.

Notes:
- Development runs in Claude Code cloud sessions (Linux container), not on the Surface. The container is wiped when a session ends, so every step ends with a push or the work is lost. There's no Browser pane here; check UI with headless Chromium at 390x844 against `npx vite preview` (Chromium doesn't emulate safe areas, so override --safe-top: 59px and --safe-bottom: 34px when screenshotting). The iPhone can't reach a cloud dev server, so phone testing happens on the deployed Pages site.
- Context7 is not set up (declined). Versions here are newer than training data (React 19.3, React Router 8, TypeScript 7, Vite 8, vite-plugin-pwa 2, Vitest 5, Dexie 4.4). Read the installed .d.ts files in node_modules before using an API you're unsure of.
- Linting is oxlint (Vite's template default now), not ESLint. `.oxlintrc.json` makes `any` an error. It prints nothing when clean.
- Commits use the GitHub noreply email because the repo is public.
- Design direction (chosen in Step 1): plate blue (#2e5bff, current set and main actions) + plate yellow (#ffd60a, PRs and finishing) as solid blocks on true black. Archivo variable font: width 62% black weight with tabular figures for numbers, normal width for text. Square corners. All of it lives in src/styles/tokens.css.
- Component styles are CSS Modules (`*.module.css`) next to each component. Icons are imported one file at a time from `@phosphor-icons/react/dist/csr/<Name>`, sized with --icon-* tokens.
- App icon: public/icon.svg (loaded bar end). After editing it, run `npm run icons` and commit the PNGs.
- Settings shows the build's git SHA and has "Check for updates". The app also checks for a new version every time it comes back to the foreground (src/pwa/updates.ts).
- `passWithNoTests` is on in vite.config.ts until Step 2 adds the first tests. Remove it then.
- Open questions to settle before Step 2: PR rule for weights never used before (proposed: a set is a PR only if no earlier working set matched or beat it on both weight and reps), whether sets without completedAt count toward stats (proposed: no), and whether nextUpRoutine should skip empty workouts and ones from other splits (proposed: yes).

Known issues: none yet
