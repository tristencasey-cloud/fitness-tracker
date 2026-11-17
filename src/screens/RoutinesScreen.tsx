import { ScreenHeader } from '../components/ScreenHeader/ScreenHeader'
import styles from './screen.module.css'

export function RoutinesScreen() {
  return (
    <>
      <ScreenHeader title="Routines" />
      <div className={styles.body}>
        <p className={styles.empty}>Routines and splits show up here.</p>
      </div>
    </>
  )
}
