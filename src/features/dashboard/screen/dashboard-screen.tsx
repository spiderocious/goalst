import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@ui/layout'
import { Button, EmptyState } from '@ui/index'
import { Plus, Target } from '@ui/icons'
import { useGoals } from '@features/goals/api/use-goals'
import { goalDetailPath } from '@shared/constants/routes'
import { StatsStrip } from './parts/stats-strip'
import { GoalCard } from './parts/goal-card'
import { CreateGoalModal } from './parts/create-goal-modal'
import type { Goal } from '@shared/types'

type SortKey = 'deadline' | 'created' | 'progress' | 'alpha'
type FilterKey = 'all' | 'in_progress' | 'completed' | 'overdue' | 'not_started'

export function DashboardScreen() {
  const navigate = useNavigate()
  const { data: goals = [], isLoading } = useGoals()
  const [createOpen, setCreateOpen] = useState(false)
  const [sort, setSort] = useState<SortKey>('deadline')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')

  function applyFilter(list: Goal[]): Goal[] {
    const now = new Date()
    let filtered = list
    if (filter === 'in_progress') filtered = list.filter((g) => g.status === 'in_progress')
    else if (filter === 'completed') filtered = list.filter((g) => g.status === 'completed')
    else if (filter === 'not_started') filtered = list.filter((g) => g.status === 'not_started')
    else if (filter === 'overdue')
      filtered = list.filter((g) => g.end_date && new Date(g.end_date) < now && g.status !== 'completed')

    if (search.trim()) {
      filtered = filtered.filter((g) =>
        g.title.toLowerCase().includes(search.toLowerCase()),
      )
    }
    return filtered
  }

  function applySort(list: Goal[]): Goal[] {
    return [...list].sort((a, b) => {
      if (sort === 'alpha') return a.title.localeCompare(b.title)
      if (sort === 'deadline') {
        if (!a.end_date) return 1
        if (!b.end_date) return -1
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      }
      if (sort === 'created') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })
  }

  const displayed = applySort(applyFilter(goals))

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">My Goals</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          New goal
        </Button>
      </div>

      {goals.length > 0 && <StatsStrip goals={goals} />}

      {/* Controls */}
      {goals.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            type="text"
            placeholder="Search goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-brand-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-brand-500 w-48"
          />
          <div className="flex items-center gap-1">
            {(['all', 'in_progress', 'not_started', 'completed', 'overdue'] as FilterKey[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    filter === f
                      ? 'bg-brand-700 text-white'
                      : 'bg-white border border-brand-200 text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  {f.replace(/_/g, ' ')}
                </button>
              ),
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-brand-200 rounded px-2.5 py-1.5 text-xs bg-white outline-none focus:border-brand-500 ml-auto"
          >
            <option value="deadline">Sort: Deadline</option>
            <option value="created">Sort: Newest</option>
            <option value="alpha">Sort: A–Z</option>
          </select>
        </div>
      )}

      {/* Goal list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={<Target size={48} />}
          title={goals.length === 0 ? "No goals yet" : "No goals match"}
          description={
            goals.length === 0
              ? "Create your first goal and start making progress."
              : "Try a different filter or search term."
          }
          action={
            goals.length === 0 ? (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus size={16} />
                Create first goal
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      <CreateGoalModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => navigate(goalDetailPath(id))}
      />
    </AppLayout>
  )
}
