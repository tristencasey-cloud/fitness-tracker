import type { ComponentType } from 'react'
import { NavLink } from 'react-router'
// One import per icon file so only these four end up in the bundle.
import { BarbellIcon } from '@phosphor-icons/react/dist/csr/Barbell'
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react/dist/csr/ClockCounterClockwise'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { ListBulletsIcon } from '@phosphor-icons/react/dist/csr/ListBullets'
import type { IconProps } from '@phosphor-icons/react/dist/lib/types'
import styles from './TabBar.module.css'

type Tab = {
  to: string
  label: string
  Icon: ComponentType<IconProps>
}

const TABS: Tab[] = [
  { to: '/', label: 'Today', Icon: BarbellIcon },
  { to: '/routines', label: 'Routines', Icon: ListBulletsIcon },
  { to: '/history', label: 'History', Icon: ClockCounterClockwiseIcon },
  { to: '/settings', label: 'Settings', Icon: GearSixIcon },
]

export function TabBar() {
  return (
    <nav className={styles.bar} aria-label="Main">
      {TABS.map(({ to, label, Icon }) => (
        // `end` on "/" stops Today from matching every route (they all start with "/").
        <NavLink key={to} to={to} end={to === '/'} className={styles.tab}>
          {({ isActive }) => (
            <>
              <Icon weight={isActive ? 'fill' : 'bold'} aria-hidden="true" />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
