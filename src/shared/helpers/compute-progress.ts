import type { Goal } from '@shared/types'

/**
 * Recursively computes a goal's progress percentage based on sub-goal completion.
 * If no sub-goals exist, returns manual_progress or 0.
 */
export function computeProgress(goal: Goal): number {
  if (!goal.sub_goals || goal.sub_goals.length === 0) {
    return goal.manual_progress ?? 0
  }

  const total = goal.sub_goals.length
  const completedWeight = goal.sub_goals.reduce((sum, sub) => {
    const subProgress = computeProgress(sub)
    return sum + subProgress / 100
  }, 0)

  return Math.round((completedWeight / total) * 100)
}
