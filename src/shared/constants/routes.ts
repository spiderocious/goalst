export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  GOAL_DETAIL: '/goals/:goalId',
  TEMPLATES: '/templates',
  SHARED_GOAL: '/share/:token',
} as const

export function goalDetailPath(goalId: string) {
  return `/goals/${goalId}`
}

export function sharedGoalPath(token: string) {
  return `/share/${token}`
}
