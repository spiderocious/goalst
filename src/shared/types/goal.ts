export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | string // custom user-defined statuses

export type CollaboratorRole = 'viewer' | 'editor' | 'owner'
export type SharePermission = 'view' | 'edit'
export type RecurrenceCadence = 'daily' | 'weekly'

export interface Goal {
  id: string
  user_id: string
  parent_goal_id: string | null
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: GoalStatus
  manual_progress: number | null
  color_tag: string | null
  is_recurring: boolean
  recurrence_cadence: RecurrenceCadence | null
  created_at: string
  updated_at: string
  // computed / joined
  sub_goals?: Goal[]
  progress?: number
  collaborators?: Collaborator[]
}

export interface Collaborator {
  goal_id: string
  user_id: string
  role: CollaboratorRole
  invited_at: string
  joined_at: string | null
  user?: {
    id: string
    email: string
  }
}

export interface ShareLink {
  id: string
  goal_id: string
  token: string
  permission: SharePermission
  created_at: string
  revoked_at: string | null
}

export interface Comment {
  id: string
  goal_id: string
  user_id: string | null
  guest_label: string | null
  body: string
  created_at: string
  user?: {
    id: string
    email: string
  }
}

export interface GoalTemplate {
  id: string
  user_id: string
  name: string
  structure: Partial<Goal>
  created_at: string
}
