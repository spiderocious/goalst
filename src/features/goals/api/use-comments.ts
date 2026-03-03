import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { Comment } from '@shared/types'

export function useComments(goalId: string) {
  return useQuery({
    queryKey: ['comments', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalst_comments')
        .select('*, user:user_id(id, email)')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Comment[]
    },
    enabled: !!goalId,
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      goalId,
      body,
      guestLabel,
    }: {
      goalId: string
      body: string
      guestLabel?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('goalst_comments')
        .insert({
          goal_id: goalId,
          body,
          user_id: user?.id ?? null,
          guest_label: user ? null : (guestLabel ?? 'Guest'),
        })
        .select()
        .single()
      if (error) throw error
      return data as Comment
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['comments', variables.goalId] })
    },
  })
}
