import type { Goal } from '@shared/types'
import { computeProgress } from '@shared/helpers'

interface StatsStripProps {
  goals: Goal[]
}

export function StatsStrip({ goals }: StatsStripProps) {
  const total = goals.length
  const completed = goals.filter((g) => g.status === 'completed').length
  const inProgress = goals.filter((g) => g.status === 'in_progress').length
  const overdue = goals.filter((g) => {
    if (!g.end_date) return false
    return new Date(g.end_date) < new Date() && g.status !== 'completed'
  }).length

  const stats = [
    { label: 'Total', value: total, color: 'text-brand-800' },
    { label: 'Completed', value: completed, color: 'text-brand-700' },
    { label: 'In Progress', value: inProgress, color: 'text-yellow-700' },
    { label: 'Overdue', value: overdue, color: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-white border border-brand-200 rounded-lg px-4 py-3 text-center"
        >
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-brand-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
