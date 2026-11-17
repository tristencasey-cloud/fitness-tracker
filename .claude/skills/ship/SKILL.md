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
