import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronRight, ChevronDown, Plus, Check, Trash2, GripVertical } from '@ui/icons'
import { Badge, Button, ProgressBar } from '@ui/index'
import { useSubGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@features/goals/api/use-goals'
import { computeProgress, formatDeadline } from '@shared/helpers'
import type { Goal, GoalStatus } from '@shared/types'

interface SubGoalTreeProps {
  parentId: string
  depth?: number
  canEdit: boolean
}

export function SubGoalTree({ parentId, depth = 0, canEdit }: SubGoalTreeProps) {
  const { data: subGoals = [], isLoading } = useSubGoals(parentId)
  const [addingTitle, setAddingTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const createGoal = useCreateGoal()

  async function handleAdd() {
    if (!addingTitle.trim()) return
    const { data: { user } } = await import('@shared/services/supabase-client').then(
      (m) => m.supabase.auth.getUser()
    )
    await createGoal.mutateAsync({
      title: addingTitle.trim(),
      parent_goal_id: parentId,
      status: 'not_started' as GoalStatus,
      user_id: user!.id,
      manual_progress: 0,
      is_recurring: false,
      recurrence_cadence: null,
      start_date: new Date().toISOString().split('T')[0],
    })
    setAddingTitle('')
    setIsAdding(false)
  }

  if (isLoading) return null

  return (
    <div className={clsx('space-y-2', depth > 0 && 'ml-5 border-l-2 border-brand-100 pl-4')}>
      {subGoals.map((sg) => (
        <SubGoalRow key={sg.id} goal={sg} depth={depth} canEdit={canEdit} />
      ))}

      {canEdit && (
        isAdding ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              autoFocus
              value={addingTitle}
              onChange={(e) => setAddingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') setIsAdding(false)
              }}
              placeholder="Sub-goal title..."
              className="flex-1 text-sm border border-brand-300 rounded px-2.5 py-1.5 outline-none focus:border-brand-600 bg-white"
            />
            <Button size="sm" onClick={handleAdd} loading={createGoal.isPending}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-700 mt-1 transition-colors"
          >
            <Plus size={13} />
            Add sub-goal
          </button>
        )
      )}
    </div>
  )
}

interface SubGoalRowProps {
  goal: Goal
  depth: number
  canEdit: boolean
}

function SubGoalRow({ goal, depth, canEdit }: SubGoalRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(goal.title)
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const { data: children = [] } = useSubGoals(goal.id)
  const progress = computeProgress({ ...goal, sub_goals: children })
  const deadline = goal.end_date ? formatDeadline(goal.end_date, goal.start_date) : null
  const isCompleted = goal.status === 'completed'

  async function toggleComplete() {
    if (!canEdit) return
    await updateGoal.mutateAsync({
      id: goal.id,
      parent_goal_id: goal.parent_goal_id ?? undefined,
      status: isCompleted ? 'in_progress' : 'completed',
      manual_progress: isCompleted ? undefined : 100,
    })
  }

  async function saveTitle() {
    if (!editTitle.trim() || editTitle === goal.title) {
      setEditing(false)
      return
    }
    await updateGoal.mutateAsync({ id: goal.id, parent_goal_id: goal.parent_goal_id ?? undefined, title: editTitle.trim() })
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${goal.title}"${children.length > 0 ? ' and all its sub-goals' : ''}?`)) return
    await deleteGoal.mutateAsync(goal.id)
  }

  return (
    <div>
      <div className="flex items-center gap-2 group py-1">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-brand-300 hover:text-brand-600 transition-colors shrink-0 w-4"
        >
          {children.length > 0 ? (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span className="block w-4" />
          )}
        </button>

        {/* Complete toggle */}
        {canEdit && (
          <button
            onClick={toggleComplete}
            className={clsx(
              'shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              isCompleted
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'border-brand-300 hover:border-brand-600',
            )}
          >
            {isCompleted && <Check size={11} strokeWidth={3} />}
          </button>
        )}

        {/* Title */}
        {editing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="flex-1 text-sm border-b border-brand-400 outline-none bg-transparent py-0.5"
          />
        ) : (
          <span
            className={clsx(
              'flex-1 text-sm font-medium',
              isCompleted ? 'line-through text-brand-400' : 'text-brand-800',
              canEdit && 'cursor-pointer hover:text-brand-600',
            )}
            onDoubleClick={() => canEdit && setEditing(true)}
          >
            {goal.title}
          </span>
        )}

        {/* Progress + deadline */}
        <div className="flex items-center gap-2 shrink-0">
          {deadline && (
            <Badge
              variant={deadline.urgency === 'overdue' || deadline.urgency === 'critical' ? 'red' : deadline.urgency === 'warning' ? 'yellow' : 'gray'}
            >
              {deadline.label}
            </Badge>
          )}
          <span className="text-xs text-brand-500 w-8 text-right">{progress}%</span>
        </div>

        {/* Delete */}
        {canEdit && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-brand-300 hover:text-red-500 transition-all shrink-0"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="ml-10">
        <ProgressBar value={progress} className="mb-1" />
      </div>

      {/* Recursive children */}
      {expanded && (
        <SubGoalTree parentId={goal.id} depth={depth + 1} canEdit={canEdit} />
      )}
    </div>
  )
}
