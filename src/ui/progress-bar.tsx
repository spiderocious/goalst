import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number // 0–100
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const color =
    clamped === 100 ? 'bg-brand-600' : clamped >= 60 ? 'bg-brand-500' : clamped >= 30 ? 'bg-yellow-500' : 'bg-brand-300'

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <div className="flex-1 h-1.5 bg-brand-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-brand-600 w-8 text-right tabular-nums">{clamped}%</span>
      )}
    </div>
  )
}
