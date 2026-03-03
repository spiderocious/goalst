import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { Collaborator, CollaboratorRole } from '@shared/types'

export function useCollaborators(goalId: string) {
  return useQuery({
    queryKey: ['collaborators', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*, user:user_id(id, email)')
        .eq('goal_id', goalId)
      if (error) throw error
      return data as Collaborator[]
    },
    enabled: !!goalId,
  })
}

export function useAddCollaborator() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      goalId,
      email,
      role,
    }: {
      goalId: string
      email: string
      role: CollaboratorRole
    }) => {
      // Look up user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (userError) throw new Error('No user found with that email')

      const { data, error } = await supabase
        .from('collaborators')
        .insert({ goal_id: goalId, user_id: userData.id, role })
        .select()
        .single()
      if (error) throw error
      return data as Collaborator
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['collaborators', variables.goalId] })
    },
  })
}

export function useUpdateCollaboratorRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      goalId,
      userId,
      role,
    }: {
      goalId: string
      userId: string
      role: CollaboratorRole
    }) => {
      const { error } = await supabase
        .from('collaborators')
        .update({ role })
        .eq('goal_id', goalId)
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['collaborators', variables.goalId] })
    },
  })
}

export function useRemoveCollaborator() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ goalId, userId }: { goalId: string; userId: string }) => {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['collaborators', variables.goalId] })
    },
  })
}
