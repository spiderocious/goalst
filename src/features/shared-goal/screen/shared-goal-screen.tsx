import { useParams } from 'react-router-dom'
import { Logo, ProgressBar, Badge } from '@ui/index'
import { computeProgress, formatDeadline } from '@shared/helpers'
import { useGoalByToken } from '@features/goals/api/use-share-links'
import { SubGoalTree } from '@features/goal-detail/screen/parts/sub-goal-tree'
import { CommentsPanel } from '@features/goal-detail/screen/parts/comments-panel'

export function SharedGoalScreen() {
  const { token } = useParams<{ token: string }>()
  const { data, isLoading, error } = useGoalByToken(token!)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 gap-4">
        <Logo size="lg" />
        <p className="text-brand-500 text-sm">This link is invalid or has been revoked.</p>
      </div>
    )
  }

  const { goal, permission } = data
  const canEdit = permission === 'edit'
  const progress = computeProgress(goal)
  const deadline = goal.end_date ? formatDeadline(goal.end_date, goal.start_date) : null

  return (
    <div className="min-h-screen bg-brand-50">
      <header className="bg-white border-b-2 border-brand-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo />
          <Badge variant="gray">{canEdit ? 'Can edit' : 'View only'}</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Goal header */}
        <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
          {goal.color_tag && (
            <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: goal.color_tag }} />
          )}
          <h1 className="text-xl font-bold text-brand-900 mb-2">{goal.title}</h1>
          {goal.description && (
            <p className="text-sm text-brand-500 mb-4">{goal.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="gray">{goal.status.replace(/_/g, ' ')}</Badge>
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
          </div>
          <ProgressBar value={progress} showLabel />
        </div>

        {/* Sub-goals */}
        <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
          <h2 className="text-sm font-bold text-brand-800 mb-4">Sub-goals</h2>
          <SubGoalTree parentId={goal.id} canEdit={canEdit} />
        </div>

        {/* Comments */}
        <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
          <CommentsPanel goalId={goal.id} canEdit={true} guestLabel="Guest" />
        </div>
      </main>
    </div>
  )
}
