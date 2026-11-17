import { useRegisterSW } from 'virtual:pwa-register/react'
import { setRegistration } from '../../pwa/updates'
import styles from './UpdateBar.module.css'

// Registers the service worker and shows a bar when a new version has
// downloaded. Nothing changes until you tap Reload, so an update never swaps
// the app out mid-workout.
export function UpdateBar() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, reg) {
      if (reg) setRegistration(reg)
    },
  })

  if (!needRefresh) return null

  return (
    <div className={styles.bar} role="status">
      <span className={styles.label}>Update ready</span>
      <button type="button" className={styles.reload} onClick={() => void updateServiceWorker(true)}>
        Reload
      </button>
    </div>
  )
}
