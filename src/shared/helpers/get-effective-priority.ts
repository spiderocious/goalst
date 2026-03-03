import type { Goal } from '@shared/types'

/**
 * Returns the effective priority of a goal:
 * own priority + sum of all descendant priorities (recursively).
 * This mirrors what the DB scores — every node contributes its own priority.
 */
export function getEffectivePriority(goal: Goal): number {
  const childrenSum =
    goal.sub_goals?.reduce((sum, child) => sum + getEffectivePriority(child), 0) ?? 0
  return goal.priority + childrenSum
}
