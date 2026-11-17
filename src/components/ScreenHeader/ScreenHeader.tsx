import type { ReactNode } from 'react'
import styles from './ScreenHeader.module.css'

type ScreenHeaderProps = {
  title: string
  /** Optional content on the right, like a timer or an action. */
  aside?: ReactNode
}

export function ScreenHeader({ title, aside }: ScreenHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={`num ${styles.title}`}>{title}</h1>
      {aside}
    </header>
  )
}
