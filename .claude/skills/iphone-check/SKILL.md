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
