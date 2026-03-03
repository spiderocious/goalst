import { Link } from 'react-router-dom'
import { goalDetailPath } from '@shared/constants/routes'
import { Badge, ProgressBar } from '@ui/index'
import { formatDeadline, computeProgress } from '@shared/helpers'
import type { Goal } from '@shared/types'
import { clsx } from 'clsx'
import { Users, ChevronRight } from '@ui/icons'

interface GoalCardProps {
  goal: Goal
}

const statusVariant: Record<string, 'green' | 'yellow' | 'gray' | 'red'> = {
  completed: 'green',
  in_progress: 'yellow',
  not_started: 'gray',
  abandoned: 'red',
}

const urgencyBorder: Record<string, string> = {
  normal: 'border-brand-200',
  warning: 'border-yellow-300',
  critical: 'border-red-300',
  overdue: 'border-red-400',
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = computeProgress(goal)
  const deadline = goal.end_date ? formatDeadline(goal.end_date, goal.start_date) : null

  return (
    <Link
      to={goalDetailPath(goal.id)}
      className={clsx(
        'block bg-white border-2 rounded-lg p-5 hover:shadow-md transition-shadow group',
        deadline ? urgencyBorder[deadline.urgency] : 'border-brand-200',
      )}
    >
      {/* Color tag */}
      {goal.color_tag && (
        <div
          className="w-full h-1 rounded-full mb-3"
          style={{ backgroundColor: goal.color_tag }}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-brand-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
          {goal.title}
        </h3>
        <ChevronRight size={16} className="shrink-0 text-brand-400 mt-0.5" />
      </div>

      {goal.description && (
        <p className="text-sm text-brand-500 mb-3 line-clamp-2">{goal.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge variant={statusVariant[goal.status] ?? 'gray'}>
          {goal.status.replace(/_/g, ' ')}
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
          <span className="flex items-center gap-1 text-xs text-brand-400">
            <Users size={12} />
            {goal.collaborators.length}
          </span>
        )}
      </div>

      <ProgressBar value={progress} showLabel />
    </Link>
  )
}
