import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { Goal } from '@shared/types'

export const GOALS_QUERY_KEY = ['goals']

export function useGoals() {
  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalst_goals')
        .select('*')
        .is('parent_goal_id', null)
        .order('end_date', { ascending: true, nullsFirst: false })

      if (error) throw error
      return data as Goal[]
    },
  })
}

export function useGoal(goalId: string) {
  return useQuery({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalst_goals')
        .select('*')
        .eq('id', goalId)
        .single()

      if (error) throw error
      return data as Goal
    },
    enabled: !!goalId,
  })
}

export function useSubGoals(parentId: string) {
  return useQuery({
    queryKey: ['sub-goals', parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalst_goals')
        .select('*')
        .eq('parent_goal_id', parentId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as Goal[]
    },
    enabled: !!parentId,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Goal>) => {
      const { data, error } = await supabase
        .from('goalst_goals')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY })
    },
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from('goalst_goals')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Goal
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['goal', variables.id] })
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY })
      if (variables.parent_goal_id) {
        qc.invalidateQueries({ queryKey: ['sub-goals', variables.parent_goal_id] })
      }
      if (variables.status) {
        qc.invalidateQueries({ queryKey: ['user-score'] })
      }
    },
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from('goalst_goals').delete().eq('id', goalId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY })
    },
  })
}
