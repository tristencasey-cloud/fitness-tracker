import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { TabBar } from '../TabBar/TabBar'
import { UpdateBar } from '../UpdateBar/UpdateBar'
import styles from './AppShell.module.css'

export function AppShell() {
  const { pathname } = useLocation()

  // Switching tabs should start at the top, not wherever the last tab was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.shell}>
      {/* The status bar is transparent (black-translucent), so this strip keeps
          scrolled content from showing behind the clock and battery. */}
      <div className={styles.statusScrim} aria-hidden="true" />
      <main className={styles.main}>
        <Outlet />
      </main>
      <UpdateBar />
      <TabBar />
    </div>
  )
}
