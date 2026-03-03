import { useMutation } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'

interface LoginPayload {
  email: string
  password: string
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },
  })
}
