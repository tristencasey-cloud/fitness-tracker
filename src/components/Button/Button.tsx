import type { ComponentPropsWithoutRef } from 'react'
import styles from './Button.module.css'

type Variant = 'accent' | 'win' | 'plain'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  /** accent = main action (blue), win = finishing/PR moments (yellow), plain = everything else */
  variant?: Variant
  /** Stretch to the full width of the parent. */
  block?: boolean
}

export function Button({ variant = 'accent', block = false, type = 'button', className, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], block && styles.block, className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
