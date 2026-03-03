import { useMutation } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'

interface SignupPayload {
  email: string
  password: string
}

export function useSignup() {
  return useMutation({
    mutationFn: async ({ email, password }: SignupPayload) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return data
    },
  })
}
