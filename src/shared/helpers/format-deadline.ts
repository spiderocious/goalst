/**
 * Returns a human-readable deadline string and urgency level.
 */
export type DeadlineUrgency = 'normal' | 'warning' | 'critical' | 'overdue'

export interface DeadlineInfo {
  label: string
  urgency: DeadlineUrgency
}

export function formatDeadline(endDate: string, startDate?: string | null): DeadlineInfo {
  const now = new Date()
  const end = new Date(endDate)
  const diffMs = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { label: `Overdue by ${Math.abs(diffDays)}d`, urgency: 'overdue' }
  }
  if (diffDays === 0) {
    return { label: 'Due today', urgency: 'critical' }
  }

  // Compute urgency relative to total window
  let urgency: DeadlineUrgency = 'normal'
  if (startDate) {
    const start = new Date(startDate)
    const totalMs = end.getTime() - start.getTime()
    const remainingRatio = diffMs / totalMs
    if (remainingRatio <= 0.1) urgency = 'critical'
    else if (remainingRatio <= 0.2) urgency = 'warning'
  } else {
    if (diffDays <= 2) urgency = 'critical'
    else if (diffDays <= 7) urgency = 'warning'
  }

  if (diffDays === 1) return { label: '1 day left', urgency }
  if (diffDays < 30) return { label: `${diffDays} days left`, urgency }

  const weeks = Math.floor(diffDays / 7)
  if (diffDays < 60) return { label: `${weeks}w left`, urgency }

  const months = Math.floor(diffDays / 30)
  return { label: `${months}mo left`, urgency }
}
