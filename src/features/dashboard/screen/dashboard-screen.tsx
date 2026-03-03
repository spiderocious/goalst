import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@ui/layout'
import { Button, EmptyState } from '@ui/index'
import { RankBadge } from '@ui/rank-badge'
import { Plus, Target, Search, SlidersHorizontal } from '@ui/icons'
import { useGoals } from '@features/goals/api/use-goals'
import { goalDetailPath } from '@shared/constants/routes'
import { StatsStrip } from './parts/stats-strip'
import { GoalCard } from './parts/goal-card'
import { CreateGoalModal } from './parts/create-goal-modal'
import type { Goal } from '@shared/types'

type SortKey = 'deadline' | 'created' | 'progress' | 'alpha'
type FilterKey = 'all' | 'in_progress' | 'completed' | 'overdue' | 'not_started'

const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'All',
  in_progress: 'Active',
  not_started: 'Not started',
  completed: 'Done',
  overdue: 'Overdue',
}

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
      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-8">
        {/* Main column */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-900 leading-tight">My Goals</h1>
              {goals.length > 0 && (
                <p className="text-sm text-brand-400 mt-0.5">{goals.length} goal{goals.length !== 1 ? 's' : ''} tracked</p>
              )}
            </div>
            <Button onClick={() => setCreateOpen(true)} size="md">
              <Plus size={15} />
              New goal
            </Button>
          </div>

          {goals.length > 0 && <StatsStrip goals={goals} />}

          {/* Controls */}
          {goals.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 sm:max-w-[220px]">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-2 border-brand-100 rounded-xl pl-9 pr-3 py-2.5 text-sm bg-white outline-none focus:border-brand-400 transition-colors placeholder:text-brand-300"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 -mb-0.5 scrollbar-hide">
                {(Object.entries(FILTER_LABELS) as [FilterKey, string][]).map(([f, label]) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                      filter === f
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'bg-white border border-brand-200 text-brand-500 hover:border-brand-400 hover:text-brand-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <SlidersHorizontal size={13} className="text-brand-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="border-2 border-brand-100 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-brand-400 text-brand-600 font-semibold cursor-pointer transition-colors"
                >
                  <option value="deadline">Deadline</option>
                  <option value="created">Newest</option>
                  <option value="alpha">A–Z</option>
                </select>
              </div>
            </div>
          )}

          {/* Goal grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-[3px] border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState
              icon={<Target size={32} />}
              title={goals.length === 0 ? 'No goals yet' : 'No goals match'}
              description={
                goals.length === 0
                  ? 'Create your first goal and start making progress.'
                  : 'Try a different filter or search term.'
              }
              action={
                goals.length === 0 ? (
                  <Button onClick={() => setCreateOpen(true)}>
                    <Plus size={15} />
                    Create first goal
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {displayed.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4 pt-[4.75rem]">
          <RankBadge expanded />
        </aside>
      </div>

      <CreateGoalModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => navigate(goalDetailPath(id))}
      />
    </AppLayout>
  )
}
