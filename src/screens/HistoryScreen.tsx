import { ScreenHeader } from '../components/ScreenHeader/ScreenHeader'
import styles from './screen.module.css'

export function HistoryScreen() {
  return (
    <>
      <ScreenHeader title="History" />
      <div className={styles.body}>
        <p className={styles.empty}>Finished workouts show up here.</p>
      </div>
    </>
  )
}
