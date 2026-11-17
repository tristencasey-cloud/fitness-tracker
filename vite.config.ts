/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const BASE = '/fitness-tracker/'

// tokens.css is the only place colors are defined. The manifest and the
// theme-color meta tag can't read CSS variables, so pull the value out of the
// file at build time instead of copying the hex code here.
function readToken(name: string): string {
  const css = readFileSync(new URL('./src/styles/tokens.css', import.meta.url), 'utf8')
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`))
  if (!match?.[1]) throw new Error(`Token --${name} not found in src/styles/tokens.css`)
  return match[1]
}

const bgColor = readToken('color-bg')

// Replaces %THEME_COLOR% in index.html with the token value.
const themeColorHtml: Plugin = {
  name: 'theme-color-html',
  transformIndexHtml: (html) => html.replaceAll('%THEME_COLOR%', bgColor),
}

// Shown in Settings so it's obvious which build the phone is running.
// GITHUB_SHA is set by GitHub Actions; local builds show "dev".
const appVersion = process.env.GITHUB_SHA?.slice(0, 7) ?? 'dev'

export default defineConfig({
  base: BASE,
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    themeColorHtml,
    VitePWA({
      // 'prompt' means a new service worker waits until the user taps Reload,
      // instead of swapping code out from under an in-progress workout.
      registerType: 'prompt',
      // Registration happens in React (useRegisterSW in UpdateBar), not via an injected script.
      injectRegister: false,
      // workbox.globPatterns below already picks up every icon in dist/,
      // so don't list them a second time.
      includeManifestIcons: false,
      manifest: {
        id: BASE,
        name: 'Fitness Tracker',
        short_name: 'Fitness',
        description: 'Personal workout log',
        display: 'standalone',
        orientation: 'portrait',
        start_url: BASE,
        scope: BASE,
        theme_color: bgColor,
        background_color: bgColor,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache everything the app needs so it opens in airplane mode.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // No tests exist until Step 2 adds src/lib. Remove this then.
    passWithNoTests: true,
  },
})
