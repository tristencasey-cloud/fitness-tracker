import { ScreenHeader } from '../components/ScreenHeader/ScreenHeader'
import styles from './screen.module.css'

export function TodayScreen() {
  return (
    <>
      <ScreenHeader title="Today" />
      <div className={styles.body}>
        <p className={styles.empty}>Your next workout shows up here once you have a split.</p>
      </div>
    </>
  )
}
