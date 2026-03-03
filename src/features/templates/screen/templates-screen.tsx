import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@ui/layout'
import { Button, EmptyState, Modal, Input } from '@ui/index'
import { BookTemplate, Trash2, Plus, ArrowRight } from '@ui/icons'
import { useTemplates, useDeleteTemplate, useSaveTemplate } from '@features/goals/api/use-templates'
import { useCreateGoal } from '@features/goals/api/use-goals'
import { goalDetailPath } from '@shared/constants/routes'
import type { Goal } from '@shared/types'

const STARTER_TEMPLATES = [
  {
    id: 'starter-fitness',
    name: 'Fitness Plan',
    structure: {
      title: 'Fitness Plan',
      description: 'Get fit and healthy',
      status: 'not_started',
    } as Partial<Goal>,
  },
  {
    id: 'starter-trip',
    name: 'Book a Trip',
    structure: {
      title: 'Book a Trip',
      description: 'Plan and book your next trip',
      status: 'not_started',
    } as Partial<Goal>,
  },
  {
    id: 'starter-project',
    name: 'Launch a Project',
    structure: {
      title: 'Launch a Project',
      description: 'Take a project from idea to launch',
      status: 'not_started',
    } as Partial<Goal>,
  },
]

export function TemplatesScreen() {
  const navigate = useNavigate()
  const { data: myTemplates = [] } = useTemplates()
  const deleteTemplate = useDeleteTemplate()
  const createGoal = useCreateGoal()
  const [saveOpen, setSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const saveTemplate = useSaveTemplate()

  async function useTemplate(structure: Partial<Goal>) {
    const { data: { user } } = await import('@shared/services/supabase-client').then(
      (m) => m.supabase.auth.getUser()
    )
    const goal = await createGoal.mutateAsync({
      ...structure,
      user_id: user!.id,
      parent_goal_id: null,
      start_date: structure.start_date ?? new Date().toISOString().split('T')[0],
      manual_progress: 0,
      is_recurring: false,
      recurrence_cadence: null,
    })
    navigate(goalDetailPath(goal.id))
  }

  async function handleSaveTemplate(e: React.FormEvent) {
    e.preventDefault()
    if (!saveName.trim()) return
    await saveTemplate.mutateAsync({
      name: saveName.trim(),
      goal: { title: saveName.trim(), status: 'not_started' },
    })
    setSaveName('')
    setSaveOpen(false)
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Templates</h1>
        <Button onClick={() => setSaveOpen(true)}>
          <Plus size={16} />
          Save template
        </Button>
      </div>

      {/* Starter templates */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">
          Starter templates
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STARTER_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="bg-white border-2 border-brand-200 rounded-lg p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <BookTemplate size={16} className="text-brand-600" />
                <span className="font-bold text-brand-800 text-sm">{t.name}</span>
              </div>
              <p className="text-xs text-brand-500 flex-1">{t.structure.description}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => useTemplate(t.structure)}
                loading={createGoal.isPending}
              >
                Use template
                <ArrowRight size={13} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* My templates */}
      <section>
        <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">
          My templates
        </h2>
        {myTemplates.length === 0 ? (
          <EmptyState
            icon={<BookTemplate size={40} />}
            title="No saved templates"
            description="Save a goal structure as a template to reuse it later."
          />
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {myTemplates.map((t) => (
              <div
                key={t.id}
                className="bg-white border-2 border-brand-200 rounded-lg p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookTemplate size={16} className="text-brand-600" />
                    <span className="font-bold text-brand-800 text-sm">{t.name}</span>
                  </div>
                  <button
                    onClick={() => deleteTemplate.mutate(t.id)}
                    className="text-brand-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => useTemplate(t.structure as Partial<Goal>)}
                  loading={createGoal.isPending}
                >
                  Use template
                  <ArrowRight size={13} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)} title="Save template">
        <form onSubmit={handleSaveTemplate} className="flex flex-col gap-4">
          <Input
            label="Template name"
            placeholder="e.g. My workout plan"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saveTemplate.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}
