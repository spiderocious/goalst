import { clsx } from 'clsx'
import { getRankInfo, RANKS } from '@features/goals/api/use-score'
import { useUserScore } from '@features/goals/api/use-score'

interface RankBadgeProps {
  className?: string
  /** Show full card with progress bar and next rank. Defaults to compact chip. */
  expanded?: boolean
}

export function RankBadge({ className, expanded = false }: RankBadgeProps) {
  const { data: score } = useUserScore()
  const total = score?.total_score ?? 0
  const rank = getRankInfo(total)

  if (!expanded) {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full',
          'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
          className,
        )}
        title={`${total} pts`}
      >
        <span>{rank.rank_emoji}</span>
        <span>{rank.rank_name}</span>
      </span>
    )
  }

  // Progress toward next rank
  const currentRankEntry = RANKS.find((r) => r.rank_name === rank.rank_name)!
  const prevThreshold = currentRankEntry.min_score
  const nextThreshold = rank.next_threshold
  const progressPct = nextThreshold
    ? Math.min(100, Math.round(((total - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
    : 100

  return (
    <div className={clsx('bg-white rounded-2xl border border-brand-100 shadow-sm p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-brand-400 uppercase tracking-widest mb-1">Your rank</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{rank.rank_emoji}</span>
            <span className="text-lg font-bold text-brand-900">{rank.rank_name}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-brand-400 mb-0.5">Total score</p>
          <p className="text-2xl font-bold text-brand-700 tabular-nums">{total.toLocaleString()}</p>
          <p className="text-[10px] text-brand-400">pts</p>
        </div>
      </div>

      {/* Progress to next rank */}
      {nextThreshold ? (
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-brand-400 mb-1.5">
            <span>{rank.rank_name}</span>
            <span>{rank.next_rank_name}</span>
          </div>
          <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-brand-400 mt-1.5 text-right">
            {(nextThreshold - total).toLocaleString()} pts to {rank.next_rank_name}
          </p>
        </div>
      ) : (
        <p className="text-xs text-brand-500 font-semibold text-center py-1">
          Maximum rank achieved 👑
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-brand-50">
        <div className="bg-brand-50/60 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-brand-800 tabular-nums">{score?.goals_completed ?? 0}</p>
          <p className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider mt-0.5">Completed</p>
        </div>
        <div className="bg-brand-50/60 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-brand-800 tabular-nums">{score?.goals_total ?? 0}</p>
          <p className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider mt-0.5">Total goals</p>
        </div>
      </div>
    </div>
  )
}
