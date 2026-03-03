import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '@ui/layout'
import { Button, Badge, ProgressBar, Modal } from '@ui/index'
import { ChevronRight, Edit2, Share2, Trash2, ChevronLeft } from '@ui/icons'
import { useGoal, useUpdateGoal, useDeleteGoal } from '@features/goals/api/use-goals'
import { computeProgress, formatDeadline } from '@shared/helpers'
import { ROUTES } from '@shared/constants/routes'
import { SubGoalTree } from './parts/sub-goal-tree'
import { CommentsPanel } from './parts/comments-panel'
import { SharePanel } from './parts/share-panel'

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
]

export function GoalDetailScreen() {
  const { goalId } = useParams<{ goalId: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading } = useGoal(goalId!)
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [shareOpen, setShareOpen] = useState(false)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!goal) {
    return (
      <AppLayout>
        <div className="text-center py-24">
          <p className="text-brand-500">Goal not found.</p>
          <Button variant="ghost" onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-4">
            Back to dashboard
          </Button>
        </div>
      </AppLayout>
    )
  }

  const progress = computeProgress(goal)
  const deadline = goal.end_date ? formatDeadline(goal.end_date, goal.start_date) : null

  function startEdit(field: string, value: string) {
    setEditingField(field)
    setEditValue(value)
  }

  async function saveField(field: string) {
    await updateGoal.mutateAsync({ id: goal!.id, [field]: editValue })
    setEditingField(null)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${goal!.title}"?`)) return
    await deleteGoal.mutateAsync(goal!.id)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <AppLayout>
      {/* Back */}
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-700 mb-5 transition-colors"
      >
        <ChevronLeft size={15} />
        Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal header card */}
          <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
            {goal.color_tag && (
              <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: goal.color_tag }} />
            )}

            {/* Title */}
            <div className="flex items-start justify-between gap-3 mb-2">
              {editingField === 'title' ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveField('title')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveField('title')
                    if (e.key === 'Escape') setEditingField(null)
                  }}
                  className="flex-1 text-xl font-bold border-b-2 border-brand-400 outline-none bg-transparent"
                />
              ) : (
                <h1
                  className="flex-1 text-xl font-bold text-brand-900 cursor-pointer hover:text-brand-700 transition-colors"
                  onClick={() => startEdit('title', goal.title)}
                >
                  {goal.title}
                </h1>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShareOpen(true)}
                  className="text-brand-400 hover:text-brand-700 transition-colors"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-brand-300 hover:text-red-500 transition-colors"
                  title="Delete goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            {editingField === 'description' ? (
              <textarea
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveField('description')}
                rows={3}
                className="w-full text-sm border border-brand-300 rounded px-3 py-2 outline-none focus:border-brand-600 resize-none bg-white mb-3"
              />
            ) : (
              <p
                className="text-sm text-brand-500 mb-3 cursor-pointer hover:text-brand-700 min-h-[1.5rem]"
                onClick={() => startEdit('description', goal.description ?? '')}
              >
                {goal.description || <span className="italic">Add a description...</span>}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Status */}
              <select
                value={goal.status}
                onChange={(e) => updateGoal.mutate({ id: goal.id, status: e.target.value })}
                className="text-xs border border-brand-200 rounded px-2 py-1 bg-brand-50 outline-none focus:border-brand-500 font-semibold text-brand-700"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-brand-500">
                <input
                  type="date"
                  value={goal.start_date ?? ''}
                  onChange={(e) => updateGoal.mutate({ id: goal.id, start_date: e.target.value })}
                  className="border border-brand-200 rounded px-2 py-1 bg-white outline-none focus:border-brand-500 text-xs"
                />
                <ChevronRight size={12} />
                <input
                  type="date"
                  value={goal.end_date ?? ''}
                  min={goal.start_date ?? undefined}
                  onChange={(e) => updateGoal.mutate({ id: goal.id, end_date: e.target.value })}
                  className="border border-brand-200 rounded px-2 py-1 bg-white outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* Deadline badge */}
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

            {/* Progress */}
            <ProgressBar value={progress} showLabel />
          </div>

          {/* Sub-goals */}
          <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
            <h2 className="text-sm font-bold text-brand-800 mb-4">Sub-goals</h2>
            <SubGoalTree parentId={goal.id} canEdit={true} />
          </div>

          {/* Comments */}
          <div className="bg-white border-2 border-brand-200 rounded-lg p-6">
            <CommentsPanel goalId={goal.id} canEdit={true} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border-2 border-brand-200 rounded-lg p-5">
            <h3 className="text-sm font-bold text-brand-800 mb-4">Sharing</h3>
            <SharePanel goalId={goal.id} />
          </div>
        </div>
      </div>

      {/* Share modal (mobile fallback) */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share goal">
        <SharePanel goalId={goal.id} />
      </Modal>
    </AppLayout>
  )
}
