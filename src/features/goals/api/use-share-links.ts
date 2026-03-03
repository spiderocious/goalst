import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { ShareLink, SharePermission } from '@shared/types'

export function useShareLinks(goalId: string) {
  return useQuery({
    queryKey: ['share-links', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('share_links')
        .select('*')
        .eq('goal_id', goalId)
        .is('revoked_at', null)
      if (error) throw error
      return data as ShareLink[]
    },
    enabled: !!goalId,
  })
}

export function useCreateShareLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      goalId,
      permission,
    }: {
      goalId: string
      permission: SharePermission
    }) => {
      const token = crypto.randomUUID().replace(/-/g, '')
      const { data, error } = await supabase
        .from('share_links')
        .insert({ goal_id: goalId, token, permission })
        .select()
        .single()
      if (error) throw error
      return data as ShareLink
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['share-links', variables.goalId] })
    },
  })
}

export function useRevokeShareLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, goalId }: { id: string; goalId: string }) => {
      const { error } = await supabase
        .from('share_links')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      return goalId
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['share-links', variables.goalId] })
    },
  })
}

export function useGoalByToken(token: string) {
  return useQuery({
    queryKey: ['shared-goal', token],
    queryFn: async () => {
      const { data: link, error: linkError } = await supabase
        .from('share_links')
        .select('*, goal:goal_id(*)')
        .eq('token', token)
        .is('revoked_at', null)
        .single()
      if (linkError) throw linkError
      return link as ShareLink & { goal: import('@shared/types').Goal }
    },
    enabled: !!token,
  })
}
