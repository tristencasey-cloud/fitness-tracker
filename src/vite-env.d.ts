// Values injected at build time by `define` in vite.config.ts.
// tsconfig uses moduleDetection: "force", so every file is a module and
// globals have to be declared inside `declare global`.
declare global {
  const __APP_VERSION__: string
  const __BUILD_TIME__: string
}

export {}
