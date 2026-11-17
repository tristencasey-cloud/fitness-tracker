import { useState } from 'react'
import { Button } from '../components/Button/Button'
import { ScreenHeader } from '../components/ScreenHeader/ScreenHeader'
import { checkForUpdate, type UpdateCheckResult } from '../pwa/updates'
import styles from './screen.module.css'

type CheckState = UpdateCheckResult | 'checking' | 'idle'

const MESSAGES: Record<CheckState, string> = {
  idle: '',
  checking: 'Checking…',
  found: 'New version found. Tap Reload when the bar appears.',
  latest: 'You have the latest version.',
  offline: "Couldn't reach the server. Try again with a connection.",
  unavailable: 'Update checks only work in the installed app.',
}

const builtAt = new Date(__BUILD_TIME__).toLocaleString(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function SettingsScreen() {
  const [check, setCheck] = useState<CheckState>('idle')

  async function handleCheck() {
    setCheck('checking')
    setCheck(await checkForUpdate())
  }

  return (
    <>
      <ScreenHeader title="Settings" />
      <div className={styles.body}>
        <section className={styles.section} aria-labelledby="settings-app">
          <h2 id="settings-app" className={styles.sectionTitle}>
            App
          </h2>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>Version</dt>
              <dd className={styles.rowValue}>{__APP_VERSION__}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>Built</dt>
              <dd className={styles.rowValue}>{builtAt}</dd>
            </div>
          </dl>
          <Button variant="plain" block onClick={() => void handleCheck()} disabled={check === 'checking'}>
            Check for updates
          </Button>
          <p className={styles.note} role="status">
            {MESSAGES[check]}
          </p>
        </section>
      </div>
    </>
  )
}
