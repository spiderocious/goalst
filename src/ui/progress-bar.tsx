import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number // 0–100
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-brand-100 rounded-full overflow-hidden border border-brand-200">
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-brand-700 w-8 text-right">{clamped}%</span>
      )}
    </div>
  )
}
