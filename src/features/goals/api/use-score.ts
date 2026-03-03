import { useQuery } from '@tanstack/react-query'
import { supabase } from '@shared/services/supabase-client'
import type { RankInfo, UserScore } from '@shared/types'

export const RANKS: Array<RankInfo & { min_score: number }> = [
  { min_score: 0,    rank_name: 'Rookie',    rank_emoji: '🌱', next_threshold: 50,   next_rank_name: 'Hustler'   },
  { min_score: 50,   rank_name: 'Hustler',   rank_emoji: '⚡', next_threshold: 150,  next_rank_name: 'Achiever'  },
  { min_score: 150,  rank_name: 'Achiever',  rank_emoji: '🎯', next_threshold: 350,  next_rank_name: 'Go-Getter' },
  { min_score: 350,  rank_name: 'Go-Getter', rank_emoji: '🔥', next_threshold: 700,  next_rank_name: 'Champion'  },
  { min_score: 700,  rank_name: 'Champion',  rank_emoji: '🏆', next_threshold: 1500, next_rank_name: 'Legend'    },
  { min_score: 1500, rank_name: 'Legend',    rank_emoji: '👑', next_threshold: null, next_rank_name: null        },
]

export function getRankInfo(score: number): RankInfo {
  const rank = [...RANKS].reverse().find((r) => score >= r.min_score) ?? RANKS[0]
  return {
    rank_name: rank.rank_name,
    rank_emoji: rank.rank_emoji,
    next_threshold: rank.next_threshold,
    next_rank_name: rank.next_rank_name,
  }
}

export function useUserScore() {
  return useQuery({
    queryKey: ['user-score'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('goalst_user_scores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error

      // If no completed goals yet, return zeroed score
      if (!data) {
        return {
          user_id: user.id,
          total_score: 0,
          goals_completed: 0,
          goals_total: 0,
        } as UserScore
      }

      return data as UserScore
    },
  })
}
