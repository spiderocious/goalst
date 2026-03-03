import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '@ui/layout'
import { Button, Badge, Modal } from '@ui/index'
import { ChevronRight, Share2, Trash2, ChevronLeft, Zap, Calendar } from '@ui/icons'
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

const statusColor: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-brand-50 text-brand-700',
  abandoned: 'bg-red-50 text-red-600',
}

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
          <div className="w-7 h-7 border-[3px] border-brand-100 border-t-brand-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!goal) {
    return (
      <AppLayout>
        <div className="text-center py-24">
          <p className="text-brand-400 mb-4">Goal not found.</p>
          <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
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
        className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-700 mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={14} />
        Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Goal header card */}
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
            {/* Color accent bar */}
            {goal.color_tag && (
              <div className="h-1.5 w-full" style={{ backgroundColor: goal.color_tag }} />
            )}

            <div className="p-6">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3 mb-3">
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
                    className="flex-1 text-xl font-bold border-b-2 border-brand-400 outline-none bg-transparent pb-0.5"
                  />
                ) : (
                  <h1
                    className="flex-1 text-xl font-bold text-brand-900 cursor-pointer hover:text-brand-700 transition-colors leading-snug"
                    onClick={() => startEdit('title', goal.title)}
                    title="Click to edit"
                  >
                    {goal.title}
                  </h1>
                )}
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-50 text-brand-500 hover:bg-brand-100 hover:text-brand-700 transition-all"
                    title="Share"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
                    title="Delete goal"
                  >
                    <Trash2 size={14} />
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
                  className="w-full text-sm border-2 border-brand-200 rounded-xl px-3 py-2 outline-none focus:border-brand-500 resize-none bg-white mb-4 transition-colors"
                />
              ) : (
                <p
                  className={`text-sm mb-4 cursor-pointer transition-colors min-h-[1.5rem] leading-relaxed ${
                    goal.description ? 'text-brand-500 hover:text-brand-700' : 'text-brand-300 hover:text-brand-500 italic'
                  }`}
                  onClick={() => startEdit('description', goal.description ?? '')}
                >
                  {goal.description || 'Add a description...'}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {/* Status */}
                <select
                  value={goal.status}
                  onChange={(e) => updateGoal.mutate({ id: goal.id, status: e.target.value })}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer transition-colors ring-1 ring-brand-100 ${statusColor[goal.status] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs bg-brand-50 rounded-full px-3 py-1.5 ring-1 ring-brand-100">
                  <Calendar size={11} className="text-brand-400 shrink-0" />
                  <input
                    type="date"
                    value={goal.start_date ?? ''}
                    onChange={(e) => updateGoal.mutate({ id: goal.id, start_date: e.target.value })}
                    className="bg-transparent outline-none text-brand-600 w-[5.5rem] cursor-pointer text-xs"
                  />
                  <ChevronRight size={10} className="text-brand-300 shrink-0" />
                  <input
                    type="date"
                    value={goal.end_date ?? ''}
                    min={goal.start_date ?? undefined}
                    onChange={(e) => updateGoal.mutate({ id: goal.id, end_date: e.target.value })}
                    className="bg-transparent outline-none text-brand-600 w-[5.5rem] cursor-pointer text-xs"
                  />
                </div>

                {/* Priority */}
                <div className="flex items-center gap-1.5 text-xs bg-brand-50 rounded-full px-3 py-1.5 ring-1 ring-brand-100">
                  <Zap size={11} className="text-brand-500 shrink-0" />
                  <span className="text-brand-500">Priority</span>
                  <input
                    type="number"
                    min={1}
                    value={goal.priority}
                    onChange={(e) =>
                      updateGoal.mutate({ id: goal.id, priority: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-10 bg-transparent outline-none font-bold text-brand-700 text-center"
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Progress</span>
                  <span className="text-sm font-bold text-brand-700 tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      progress === 100
                        ? 'bg-brand-600'
                        : progress >= 60
                        ? 'bg-brand-500'
                        : progress >= 30
                        ? 'bg-yellow-500'
                        : 'bg-brand-300'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-goals */}
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">Sub-goals</h2>
            <SubGoalTree parentId={goal.id} canEdit={true} />
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
            <CommentsPanel goalId={goal.id} canEdit={true} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">Sharing</h3>
            <SharePanel goalId={goal.id} />
          </div>
        </div>
      </div>

      {/* Share modal (mobile) */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share goal">
        <SharePanel goalId={goal.id} />
      </Modal>
    </AppLayout>
  )
}
