import { useState } from 'react'
import { Modal, Button, Input, Textarea } from '@ui/index'
import { useCreateGoal } from '@features/goals/api/use-goals'
import type { GoalStatus } from '@shared/types'

interface CreateGoalModalProps {
  open: boolean
  onClose: () => void
  onCreated?: (goalId: string) => void
}

const COLOR_OPTIONS = [
  { label: 'No color', value: '' },
  { label: 'Forest green', value: '#166534' },
  { label: 'Sky blue', value: '#0284c7' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Purple', value: '#7c3aed' },
]

const COLOR_SWATCHES = COLOR_OPTIONS.filter((c) => c.value)

export function CreateGoalModal({ open, onClose, onCreated }: CreateGoalModalProps) {
  const createGoal = useCreateGoal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [colorTag, setColorTag] = useState('')
  const [priority, setPriority] = useState(1)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    try {
      const { data: { user } } = await import('@shared/services/supabase-client').then(
        (m) => m.supabase.auth.getUser()
      )
      const goal = await createGoal.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate || null,
        status: 'not_started' as GoalStatus,
        color_tag: colorTag || null,
        priority: Math.max(1, priority),
        user_id: user!.id,
        parent_goal_id: null,
        manual_progress: 0,
        is_recurring: false,
        recurrence_cadence: null,
      })
      onCreated?.(goal.id)
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create goal')
    }
  }

  function handleClose() {
    setTitle('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setColorTag('')
    setPriority(1)
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="New goal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="What do you want to achieve?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
        <Textarea
          label="Description"
          placeholder="Describe your goal (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>

        {/* Color swatch picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Color tag</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setColorTag('')}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                colorTag === '' ? 'border-brand-600 scale-110' : 'border-brand-200 hover:border-brand-400'
              } bg-white`}
              title="No color"
            />
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColorTag(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  colorTag === c.value ? 'border-brand-900 scale-110' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
            Priority <span className="normal-case font-normal text-brand-400">— affects score points</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={20}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="flex-1 accent-brand-600 h-1.5"
            />
            <span className="w-8 text-center text-sm font-bold text-brand-700 tabular-nums">{priority}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
            <span className="text-red-500 text-sm mt-px">⚠</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createGoal.isPending}>
            Create goal
          </Button>
        </div>
      </form>
    </Modal>
  )
}
