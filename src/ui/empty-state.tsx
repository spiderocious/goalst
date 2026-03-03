import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="mb-4 text-brand-300">{icon}</div>}
      <h3 className="text-base font-bold text-brand-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-brand-500 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}
