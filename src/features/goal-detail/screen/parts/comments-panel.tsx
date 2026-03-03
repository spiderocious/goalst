import { useState } from 'react'
import { useComments, useAddComment } from '@features/goals/api/use-comments'
import { useAuth } from '@features/auth/providers/auth-provider'
import { Button } from '@ui/index'
import { MessageSquare } from '@ui/icons'

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
      <h3 className="flex items-center gap-2 text-sm font-bold text-brand-800 mb-3">
        <MessageSquare size={15} />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Comment list */}
      <div className="space-y-3 mb-4">
        {comments.length === 0 && (
          <p className="text-xs text-brand-400">No comments yet.</p>
        )}
        {comments.map((c) => {
          const author = c.user?.email ?? c.guest_label ?? 'Guest'
          const date = new Date(c.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <div key={c.id} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-xs font-bold text-brand-700 shrink-0 mt-0.5">
                {author[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-brand-700">{author}</span>
                  <span className="text-xs text-brand-400">{date}</span>
                </div>
                <p className="text-sm text-brand-800 leading-relaxed">{c.body}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add comment */}
      {canEdit && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={user ? 'Leave a comment...' : 'Comment as Guest...'}
            className="flex-1 text-sm border border-brand-200 rounded px-3 py-2 outline-none focus:border-brand-600 bg-white"
          />
          <Button size="sm" type="submit" loading={addComment.isPending} disabled={!body.trim()}>
            Post
          </Button>
        </form>
      )}
    </div>
  )
}
