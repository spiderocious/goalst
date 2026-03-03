import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  red: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  gray: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
  blue: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
