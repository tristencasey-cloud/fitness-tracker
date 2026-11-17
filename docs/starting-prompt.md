# Fitness Tracker: Phase 1 Starting Prompt

You're building a personal workout tracker for me (Tristen). It's a PWA that I'll use on my iPhone as a home screen web app, hosted on GitHub Pages. I'm developing on a Surface Pro running Windows 11 on ARM, using the Claude desktop app's Code tab.

About me: I'm a junior IT student heading into cybersecurity. I've used React before but I'm still learning it, and I'm new to TypeScript. When you make a decision I might not understand, explain it in a sentence or two. Don't explain basic programming.

## How we're going to work

- Phase 1 is split into Steps 0 through 5 below. Do one step at a time.
- At the start of each step, give me a short plan. At the end of each step: run typecheck and tests, tell me exactly what to test (in the Browser pane and on my iPhone), update the Status section in CLAUDE.md, and **stop**. Don't start the next step until I tell you to.
- When checking UI in the Browser pane, use an iPhone-sized viewport (390 x 844). If something only shows up on a real phone, ask me for a screenshot.
- If you want to add a dependency that isn't listed here, tell me why first.
- My GitHub username is `tristencasey-cloud` and the repo is `fitness-tracker` (already created, empty).

---

## Step 0: Environment and repo setup

1. Check `git --version`, `node -v`, and `npm -v`.
2. If Node is missing, install the LTS version with `winget install OpenJS.NodeJS.LTS` (it should pick the ARM64 build automatically). If `node` still isn't found afterward, tell me to restart the Claude app so the PATH refreshes, then stop.
3. Check that `git config --global user.name` and `user.email` are set. If not, ask me for them.
4. `git init` with `main` as the default branch, and add the remote `https://github.com/tristencasey-cloud/fitness-tracker.git`.
5. Create `CLAUDE.md` using the content in the "CLAUDE.md" section at the bottom of this file.
6. Create the three skills from the "Skills" section at the bottom of this file.
7. Move this file to `docs/starting-prompt.md` so future sessions can reference it.
8. Add a `.gitignore` for a Node/Vite project.
9. Ask me if I want Context7 set up (it gives you current library docs instead of relying on memory). If I say yes, run `npx ctx7 setup --claude`, tell me it will open a browser to authorize, and tell me what it changed in my config.
10. Commit. Don't push yet. Tell me to start a new session so the new skills load.

## Step 1: Scaffold, deploy pipeline, and install on iPhone

**Project**
- Vite + React + TypeScript (strict mode). Keep Vite's default ESLint setup. Add Vitest.
- Add scripts: `dev`, `build`, `preview`, `test`, `typecheck`, `lint`.
- Set the Vite `base` to `/fitness-tracker/`.
- Use React Router with `HashRouter`. Explain to me why GitHub Pages needs this.

**PWA**
- Use `vite-plugin-pwa`. Manifest: name "Fitness Tracker", short_name "Fitness", display `standalone`, `start_url` and `scope` matching the base path, and theme/background colors pulled from the design tokens.
- Use `registerType: 'prompt'` and build a small in-app bar that says "Update ready" with a reload button. iPhone home screen apps hang on to old versions, and this is how I'll get new ones.
- In `index.html`: viewport meta with `viewport-fit=cover`, `apple-mobile-web-app-capable`, status bar style `black-translucent`, and an `apple-touch-icon` (180x180).
- Icons: design a real icon that matches the visual direction (not a generic placeholder), as an SVG. Generate the PNGs (180, 192, 512, plus a maskable version) with a script using `@vite-pwa/assets-generator` or `sharp`.
- Fonts must be self-hosted (for example with `@fontsource`) so the app works offline. No CDN requests of any kind.
- Icons: use `@phosphor-icons/react`, only the `bold` and `fill` weights, to match the loud and bold direction. Import icons one by one so unused ones get left out of the build.

**Deploy**
- GitHub Actions workflow: on push to `main`, run `npm ci`, typecheck, test, build, then deploy with `actions/upload-pages-artifact` and `actions/deploy-pages`.

**App shell**
- Bottom tab bar with four tabs: **Today**, **Routines**, **History**, **Settings**. Placeholder screens for now.
- Handle iOS safe areas (notch and home indicator) with `env(safe-area-inset-*)`.
- Use the frontend-design skill to create the visual system (see Design in CLAUDE.md): `src/styles/tokens.css` for colors, type scale, spacing, radii, and motion, plus base styles and the tab bar. This sets the look for the whole app, so take it seriously.

**Finish**
- Push to `main`. Then walk me through: (1) setting the repo's Pages source to "GitHub Actions" in Settings > Pages, (2) opening the URL in Safari on my iPhone and using Share > Add to Home Screen, (3) checking that it opens full screen with no Safari bars, and (4) turning on airplane mode and confirming it still opens.

## Step 2: Data layer

- Use Dexie and `dexie-react-hooks`. The database name is `fitness-tracker-db`.
- All database access goes through functions in `src/db/`. Components never touch Dexie tables directly.
- Call `navigator.storage.persist()` on first launch.
- Create the schema below. It includes fields for features that come later (RPE, notes, supersets, cardio, body weight) so we never have to restructure sets.

**Tables**
- `exercises`: id, name, muscleGroup, equipment (`barbell | dumbbell | machine | cable | bodyweight | other`), kind (`strength | cardio`), isCustom, archived
- `routines`: id, name, exercises (an ordered array of `{ exerciseId, targetSets, repMin, repMax, supersetGroup? }`), createdAt, updatedAt
- `splits`: id, name, routineIds (ordered rotation), isActive
- `workouts`: id, routineId (optional), status (`active | finished`), startedAt, endedAt, notes
- `sets`: id, workoutId, exerciseId, exerciseOrder, setOrder, supersetGroup (optional), weight, reps, isWarmup, rpe (optional), note (optional), completedAt (optional)
- `cardioEntries`: id, workoutId, exerciseId, durationSec, distance (optional), distanceUnit, calories (optional), note (optional)
- `bodyWeights`: id, date, weight
- `settings`: key/value pairs (units = lbs, barWeight = 45, plates = [45, 35, 25, 10, 5, 2.5], lastBackupAt)

Index what we'll query often, especially sets by exercise and completion time, and sets by workout.

**Seed data (first run only)**
- **Exercise library source:** use the public domain dataset from https://github.com/yuhonas/free-exercise-db (Unlicense). Write a one-time Node script in `scripts/` that downloads `dist/exercises.json` and generates `src/db/seed/exercises.ts`, which gets committed. The app itself never fetches it at runtime.
  - Keep the strength, powerlifting, olympic weightlifting, and cardio categories. Drop stretching, plyometrics, and strongman.
  - Map its `primaryMuscles` and `equipment` values onto our muscleGroup and equipment fields. Keep the dataset's id as a `sourceId` field.
  - Drop instructions and images to keep the bundle small.
  - Its names can be wordy (for example "Barbell Bench Press - Medium Grip"). Add a small rename map so the exercises in my PPL routines below get clean names.
  - Tell me how many exercises made it in and the bundle size of the generated file.
- Make sure there's a cardio entry for: treadmill, bike, rower, stair climber, elliptical, outdoor run, and walk. Add any that are missing from the dataset.
- A split called "PPL" with three routines. These are starting points I'll edit in the app:
  - **Push:** Barbell Bench Press 3x6-8, Overhead Press 3x8-10, Incline Dumbbell Press 3x8-12, Cable Lateral Raise 3x12-15, Triceps Pushdown 3x10-12, Overhead Triceps Extension 2x12-15
  - **Pull:** Pull-Up 3x6-10, Barbell Row 3x6-8, Lat Pulldown 3x10-12, Seated Cable Row 3x10-12, Face Pull 3x15-20, Barbell Curl 3x8-12, Hammer Curl 2x10-12
  - **Legs:** Back Squat 3x5-8, Romanian Deadlift 3x8-10, Leg Press 3x10-12, Lying Leg Curl 3x10-12, Standing Calf Raise 4x10-15

**Pure logic in `src/lib/` with Vitest tests**
- `topWorkingSet(sets)`, `isPR(newSet, history)`, `lastSessionFor(exerciseId)` (the query plus the logic), `workoutVolume(sets)`, `formatDuration(ms)`, and `nextUpRoutine(split, lastFinishedWorkout)`. Follow the definitions in CLAUDE.md exactly.

## Step 3: Exercise library, routines, and splits

- **Exercise library:** search, filter by muscle group, add a custom exercise, archive one (never hard delete an exercise that has history).
- **Routines:** create, edit, delete, reorder exercises, and set target sets and rep range per exercise.
- **Splits:** a split is an ordered rotation of routines and only one is active. I need to be able to make a new split later and switch to it.
- **Today screen:** a big "Next up: Pull" card based on the active split and my last finished workout, with a Start button. Also a smaller option to start an empty workout.

## Step 4: Logging a workout (the most important screen)

- Start from a routine (prefills exercises and set rows from the targets) or start empty and add exercises as I go. In both cases I can add or remove exercises and sets mid-workout.
- Only one active workout at a time. Everything saves to IndexedDB as I type, with no save button. If I close the app mid-workout, reopening it drops me right back in.
- **Workout timer:** store `startedAt` and show elapsed time live. It has to be correct after the app was closed or the phone was locked, so calculate it from the timestamp and never use a counting interval as the source of truth. "Finish" sets `endedAt`. Use the Screen Wake Lock API to keep the screen on during an active workout (fail silently if it's unsupported).
- **Each exercise** shows a header with last session's top working set and the date.
- **Each set row** shows: weight, reps, a warm-up toggle, and a check-off. Beside each row, show what I did for the matching set last session. New rows prefill from last session's matching set.
- **Inputs:** use `inputmode` for numeric keyboards and font-size of at least 16px (anything smaller makes iOS zoom in). Add big +/- steppers (5 lb, 1 rep), because typing with sweaty fingers is miserable. Every touch target is at least 48px.
- **Finish screen:** duration, working set count, total volume, and the top set per exercise. Make finishing feel like a big moment visually (see Design).
- The schema supports RPE, notes, and supersets, but don't build that UI yet.

## Step 5: History and backup

- **History tab:** list of finished workouts (date, routine name, duration). Tap one to see its details, then edit or delete it.
- **Export:** all data to a JSON file with `schemaVersion` and `exportedAt`. Use the Web Share API with a file when it's available, so I get the iOS share sheet and can save to Files. Fall back to a normal download.
- **Import:** validate the file, show me counts of what's in it, then confirm before replacing everything.
- **Settings** shows "Last backup: X days ago", highlighted if it's been more than 14 days.
- **Dev-only tools** (visible only when `import.meta.env.DEV` is true): "Load sample history" (8 weeks of realistic PPL data with gradual progression) and "Clear all data." I'll use these to test charts in phase 3.

---

## CLAUDE.md

Create `CLAUDE.md` in the project root with exactly this content:

````markdown
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
- [ ] Step 0: Environment and repo
- [ ] Step 1: Scaffold, deploy, iPhone install
- [ ] Step 2: Data layer
- [ ] Step 3: Library, routines, splits
- [ ] Step 4: Workout logging
- [ ] Step 5: History and backup

Known issues: none yet
````

---

## Skills

Create these three files.

### `.claude/skills/ship/SKILL.md`

````markdown
---
name: ship
description: Check, commit, and push the current work so it deploys to GitHub Pages. Only run when I type /ship.
disable-model-invocation: true
---

1. Run `npm run typecheck`, `npm test`, and `npm run build`. If anything fails, stop, show me the errors in plain English, and don't commit.
2. If a step from the Status section of CLAUDE.md is now finished, update Status first.
3. Show me a short plain-English summary of what changed.
4. Commit with a clear message (imperative mood, saying what changed and why).
5. Push to main.
6. Tell me the deploy takes a minute or two, give me the URL, and remind me that the iPhone app will show the "Update ready" bar once it's live.
````

### `.claude/skills/iphone-check/SKILL.md`

````markdown
---
name: iphone-check
description: Review UI changes for problems specific to iPhone home screen web apps. Use after building or changing any screen, or when I type /iphone-check.
---

Review the screens changed in the current work against this list. Report each problem with the file and a fix. Don't make changes until I say so.

- Content hidden under the notch, the status bar, or the home indicator (safe-area insets missing)
- Any input under 16px font-size (iOS will zoom in)
- Number inputs missing inputmode
- Touch targets under 48px, or primary actions out of thumb reach
- Anything that depends on hover
- Use of the Vibration API or other APIs iOS Safari doesn't support
- Timers or elapsed time that depend on a running interval instead of a stored timestamp
- Any network request at runtime (fonts, scripts, images, APIs)
- Hardcoded colors, sizes, or fonts instead of tokens
- Motion that ignores prefers-reduced-motion
- Layout that breaks at 375px wide (iPhone mini/SE) or in landscape
````

### `.claude/skills/explain/SKILL.md`

````markdown
---
name: explain
description: Explain recent changes so I learn from them. Only run when I type /explain.
disable-model-invocation: true
argument-hint: "[file or feature, or leave blank for the last commit]"
---

Explain $ARGUMENTS. If it's blank, explain the most recent commit.

I'm an IT student who knows programming but is still learning React, TypeScript, and how web apps work on iPhone. Cover:
1. What changed and why, file by file, in a sentence or two each
2. How the data flows (what the user does, what code runs, what gets saved)
3. One concept from this change that I probably don't know yet, explained properly
4. One question I could answer to check that I understood it

Keep it under about 350 words. Plain language, no filler.
````

---

## First action

You're in plan mode. Read this whole file, then give me your plan for **Step 0 only**. Flag anything in this document that seems wrong or risky before we start.
