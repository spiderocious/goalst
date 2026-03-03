import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-brand-100 text-brand-800 border-brand-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
