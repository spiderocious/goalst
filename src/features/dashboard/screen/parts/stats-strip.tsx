import type { Goal } from '@shared/types'

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
    {
      label: 'Total',
      value: total,
      bg: 'bg-brand-700',
      text: 'text-white',
      sub: 'text-brand-200',
    },
    {
      label: 'Completed',
      value: completed,
      bg: 'bg-white',
      text: 'text-brand-800',
      sub: 'text-brand-400',
    },
    {
      label: 'In Progress',
      value: inProgress,
      bg: 'bg-white',
      text: 'text-yellow-700',
      sub: 'text-brand-400',
    },
    {
      label: 'Overdue',
      value: overdue,
      bg: 'bg-white',
      text: overdue > 0 ? 'text-red-600' : 'text-brand-800',
      sub: 'text-brand-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, bg, text, sub }) => (
        <div
          key={label}
          className={`${bg} rounded-2xl px-4 py-3.5 border border-brand-100 shadow-sm`}
        >
          <div className={`text-3xl font-bold tabular-nums leading-none ${text}`}>{value}</div>
          <div className={`text-xs font-semibold mt-1.5 ${sub}`}>{label}</div>
        </div>
      ))}
    </div>
  )
}
