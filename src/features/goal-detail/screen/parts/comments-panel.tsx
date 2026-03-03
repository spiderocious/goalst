import { useState } from 'react'
import { useComments, useAddComment } from '@features/goals/api/use-comments'
import { useAuth } from '@features/auth/providers/auth-provider'
import { Button } from '@ui/index'
import { MessageSquare, Send } from '@ui/icons'

interface CommentsPanelProps {
  goalId: string
  canEdit: boolean
  guestLabel?: string
}

export function CommentsPanel({ goalId, canEdit, guestLabel }: CommentsPanelProps) {
  const { data: comments = [] } = useComments(goalId)
  const addComment = useAddComment()
  const { user } = useAuth()
  const [body, setBody] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    await addComment.mutateAsync({ goalId, body: body.trim(), guestLabel })
    setBody('')
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={14} className="text-brand-400" />
        <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest">
          Comments{comments.length > 0 ? ` (${comments.length})` : ''}
        </h3>
      </div>

      {/* Comment list */}
      <div className="space-y-4 mb-5">
        {comments.length === 0 && (
          <p className="text-xs text-brand-300 italic">No comments yet. Be the first.</p>
        )}
        {comments.map((c) => {
          const author = c.user?.email ?? c.guest_label ?? 'Guest'
          const initials = author[0].toUpperCase()
          const date = new Date(c.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-semibold text-brand-700">{author}</span>
                  <span className="text-[10px] text-brand-300">{date}</span>
                </div>
                <p className="text-sm text-brand-700 leading-relaxed bg-brand-50/60 rounded-xl rounded-tl-sm px-3 py-2">
                  {c.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add comment */}
      {canEdit && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={user ? 'Leave a comment...' : 'Comment as Guest...'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (body.trim()) handleSubmit(e as unknown as React.FormEvent)
              }
            }}
            className="flex-1 text-sm border-2 border-brand-100 rounded-xl px-4 py-2.5 outline-none focus:border-brand-400 bg-white transition-colors placeholder:text-brand-300"
          />
          <Button size="sm" type="submit" loading={addComment.isPending} disabled={!body.trim()}>
            <Send size={13} />
          </Button>
        </form>
      )}
    </div>
  )
}
