// Keeps hold of the service worker registration so Settings can trigger an
// update check, and checks automatically whenever the app comes back to the
// foreground.

let registration: ServiceWorkerRegistration | undefined

export type UpdateCheckResult = 'found' | 'latest' | 'offline' | 'unavailable'

export function setRegistration(reg: ServiceWorkerRegistration): void {
  if (registration) return
  registration = reg

  // iPhone home screen apps get suspended in the background instead of
  // relaunching, so the browser's own "check on page load" rarely happens.
  // Checking each time the app is brought back up makes new versions show up
  // the next time you open it.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForUpdate()
  })
}

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  // No registration means the service worker isn't running: the dev server,
  // or a browser that doesn't support them.
  if (!registration) return 'unavailable'
  try {
    await registration.update()
  } catch {
    return 'offline'
  }
  // A new worker is either still installing or waiting for the Reload tap.
  return registration.installing || registration.waiting ? 'found' : 'latest'
}
