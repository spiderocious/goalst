import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="mb-5 w-16 h-16 flex items-center justify-center rounded-2xl bg-brand-50 text-brand-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-brand-800 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-brand-400 mb-6 max-w-xs leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  )
}
