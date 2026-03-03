import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { Goal, GoalTemplate } from '@shared/types'

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalst_templates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as GoalTemplate[]
    },
  })
}

export function useSaveTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, goal }: { name: string; goal: Partial<Goal> }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('goalst_templates')
        .insert({ name, structure: goal, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as GoalTemplate
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase.from('goalst_templates').delete().eq('id', templateId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}
