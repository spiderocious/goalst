import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronRight, ChevronDown, Plus, Check, Trash2, Zap } from '@ui/icons'
import { Button } from '@ui/index'
import { useSubGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@features/goals/api/use-goals'
import { computeProgress } from '@shared/helpers'
import type { Goal, GoalStatus } from '@shared/types'

interface SubGoalTreeProps {
  parentId: string
  depth?: number
  canEdit: boolean
}

export function SubGoalTree({ parentId, depth = 0, canEdit }: SubGoalTreeProps) {
  const { data: subGoals = [], isLoading } = useSubGoals(parentId)
  const [addingTitle, setAddingTitle] = useState('')
  const [addingPriority, setAddingPriority] = useState(1)
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
      priority: Math.max(1, addingPriority),
      start_date: new Date().toISOString().split('T')[0],
    })
    setAddingTitle('')
    setAddingPriority(1)
    setIsAdding(false)
  }

  if (isLoading) return null

  return (
    <div className={clsx('space-y-1', depth > 0 && 'ml-6 border-l-2 border-brand-100 pl-4 mt-1')}>
      {subGoals.map((sg) => (
        <SubGoalRow key={sg.id} goal={sg} depth={depth} canEdit={canEdit} />
      ))}

      {canEdit && (
        isAdding ? (
          <div className="flex flex-col gap-3 mt-2 bg-brand-50/60 border border-brand-100 rounded-xl p-3.5">
            <input
              autoFocus
              value={addingTitle}
              onChange={(e) => setAddingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') setIsAdding(false)
              }}
              placeholder="Sub-goal title..."
              className="text-sm border-2 border-brand-100 rounded-xl px-3 py-2 outline-none focus:border-brand-400 bg-white transition-colors"
            />
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-brand-400 shrink-0" />
              <span className="text-xs text-brand-500">Priority</span>
              <input
                type="range"
                min={1}
                max={20}
                value={addingPriority}
                onChange={(e) => setAddingPriority(Number(e.target.value))}
                className="flex-1 accent-brand-600"
              />
              <span className="text-xs font-bold text-brand-700 w-4 tabular-nums">{addingPriority}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} loading={createGoal.isPending}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-700 mt-2 transition-colors group"
          >
            <span className="w-5 h-5 rounded-full border-2 border-dashed border-brand-200 flex items-center justify-center group-hover:border-brand-400 transition-colors">
              <Plus size={10} />
            </span>
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
  const [editingPriority, setEditingPriority] = useState(false)
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const { data: children = [] } = useSubGoals(goal.id)
  const progress = computeProgress({ ...goal, sub_goals: children })
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

  async function savePriority(val: number) {
    const p = Math.max(1, val)
    if (p === goal.priority) { setEditingPriority(false); return }
    await updateGoal.mutateAsync({ id: goal.id, parent_goal_id: goal.parent_goal_id ?? undefined, priority: p })
    setEditingPriority(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${goal.title}"${children.length > 0 ? ' and all its sub-goals' : ''}?`)) return
    await deleteGoal.mutateAsync(goal.id)
  }

  return (
    <div className="group/row">
      <div className="flex items-center gap-2 py-1.5 px-1 rounded-xl hover:bg-brand-50/50 transition-colors">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-brand-300 hover:text-brand-600 transition-colors shrink-0 w-4 h-4 flex items-center justify-center"
        >
          {children.length > 0 ? (
            expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />
          ) : (
            <span className="block w-4" />
          )}
        </button>

        {/* Complete toggle */}
        {canEdit && (
          <button
            onClick={toggleComplete}
            className={clsx(
              'shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all',
              isCompleted
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'border-brand-200 hover:border-brand-500',
            )}
          >
            {isCompleted && <Check size={10} strokeWidth={3} />}
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
            className="flex-1 text-sm border-b-2 border-brand-400 outline-none bg-transparent py-0.5"
          />
        ) : (
          <span
            className={clsx(
              'flex-1 text-sm font-medium leading-snug',
              isCompleted ? 'line-through text-brand-300' : 'text-brand-800',
              canEdit && 'cursor-pointer',
            )}
            onDoubleClick={() => canEdit && setEditing(true)}
          >
            {goal.title}
          </span>
        )}

        {/* Progress % */}
        <span className="text-xs font-bold text-brand-400 w-8 text-right tabular-nums shrink-0">
          {progress}%
        </span>

        {/* Priority */}
        {canEdit && (
          editingPriority ? (
            <input
              autoFocus
              type="number"
              min={1}
              defaultValue={goal.priority}
              onBlur={(e) => savePriority(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') savePriority(Number((e.target as HTMLInputElement).value))
                if (e.key === 'Escape') setEditingPriority(false)
              }}
              className="w-10 text-xs border-2 border-brand-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-brand-500 bg-white text-center"
            />
          ) : (
            <button
              onClick={() => setEditingPriority(true)}
              title="Click to edit priority"
              className="flex items-center gap-0.5 text-[10px] text-brand-300 hover:text-brand-600 transition-colors shrink-0"
            >
              <Zap size={10} />
              {goal.priority}
            </button>
          )
        )}

        {/* Delete */}
        {canEdit && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover/row:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-brand-300 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="ml-10 pr-2">
        <div className="h-1 bg-brand-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-brand-600' : progress >= 50 ? 'bg-brand-400' : 'bg-brand-200'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Recursive children */}
      {expanded && (
        <SubGoalTree parentId={goal.id} depth={depth + 1} canEdit={canEdit} />
      )}
    </div>
  )
}
