import { useState } from 'react'
import { Modal, Button, Input, Textarea, Select } from '@ui/index'
import { useCreateGoal } from '@features/goals/api/use-goals'
import type { GoalStatus } from '@shared/types'

interface CreateGoalModalProps {
  open: boolean
  onClose: () => void
  onCreated?: (goalId: string) => void
}

const COLOR_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Forest green', value: '#166534' },
  { label: 'Sky blue', value: '#0284c7' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Purple', value: '#7c3aed' },
]

export function CreateGoalModal({ open, onClose, onCreated }: CreateGoalModalProps) {
  const createGoal = useCreateGoal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [colorTag, setColorTag] = useState('')
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
        <Select
          label="Color tag"
          value={colorTag}
          onChange={(e) => setColorTag(e.target.value)}
          options={COLOR_OPTIONS}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-1">
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
