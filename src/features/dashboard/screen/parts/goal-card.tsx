import { Link } from 'react-router-dom'
import { goalDetailPath } from '@shared/constants/routes'
import { Badge, ProgressBar } from '@ui/index'
import { formatDeadline, computeProgress } from '@shared/helpers'
import type { Goal } from '@shared/types'
import { clsx } from 'clsx'
import { Users, ArrowUpRight } from '@ui/icons'

interface GoalCardProps {
  goal: Goal
}

const statusVariant: Record<string, 'green' | 'yellow' | 'gray' | 'red'> = {
  completed: 'green',
  in_progress: 'yellow',
  not_started: 'gray',
  abandoned: 'red',
}

const statusLabel: Record<string, string> = {
  completed: 'Done',
  in_progress: 'Active',
  not_started: 'Not started',
  abandoned: 'Abandoned',
}

const urgencyAccent: Record<string, string> = {
  normal: '',
  warning: 'border-l-4 border-l-yellow-400',
  critical: 'border-l-4 border-l-red-400',
  overdue: 'border-l-4 border-l-red-500',
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = computeProgress(goal)
  const deadline = goal.end_date ? formatDeadline(goal.end_date, goal.start_date) : null
  const urgency = deadline?.urgency ?? 'normal'

  return (
    <Link
      to={goalDetailPath(goal.id)}
      className={clsx(
        'group relative flex flex-col bg-white rounded-2xl border border-brand-100 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden',
        urgencyAccent[urgency],
      )}
    >
      {/* Color tag stripe */}
      {goal.color_tag && (
        <div className="h-1 w-full" style={{ backgroundColor: goal.color_tag }} />
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-brand-900 text-sm leading-snug line-clamp-2 flex-1 group-hover:text-brand-700 transition-colors">
            {goal.title}
          </h3>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-brand-300 group-hover:text-brand-600 transition-colors mt-0.5"
          />
        </div>

        {goal.description && (
          <p className="text-xs text-brand-400 line-clamp-2 leading-relaxed">{goal.description}</p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusVariant[goal.status] ?? 'gray'}>
            {statusLabel[goal.status] ?? goal.status}
          </Badge>
          {deadline && (
            <Badge
              variant={
                deadline.urgency === 'overdue' || deadline.urgency === 'critical'
                  ? 'red'
                  : deadline.urgency === 'warning'
                  ? 'yellow'
                  : 'gray'
              }
            >
              {deadline.label}
            </Badge>
          )}
          {goal.collaborators && goal.collaborators.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-400 bg-brand-50 px-2 py-0.5 rounded-full ring-1 ring-brand-100">
              <Users size={10} />
              {goal.collaborators.length}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-auto pt-1">
          <ProgressBar value={progress} showLabel />
        </div>
      </div>
    </Link>
  )
}
