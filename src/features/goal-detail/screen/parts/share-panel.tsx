import { useState } from 'react'
import { useShareLinks, useCreateShareLink, useRevokeShareLink } from '@features/goals/api/use-share-links'
import { useCollaborators, useAddCollaborator, useRemoveCollaborator } from '@features/goals/api/use-collaborators'
import { Button, Badge, Input, Select } from '@ui/index'
import { Link2, Copy, X, UserPlus, Users } from '@ui/icons'
import { sharedGoalPath } from '@shared/constants/routes'
import type { SharePermission, CollaboratorRole } from '@shared/types'

interface SharePanelProps {
  goalId: string
}

export function SharePanel({ goalId }: SharePanelProps) {
  const { data: links = [] } = useShareLinks(goalId)
  const { data: collaborators = [] } = useCollaborators(goalId)
  const createLink = useCreateShareLink()
  const revokeLink = useRevokeShareLink()
  const addCollaborator = useAddCollaborator()
  const removeCollaborator = useRemoveCollaborator()

  const [linkPermission, setLinkPermission] = useState<SharePermission>('view')
  const [collabEmail, setCollabEmail] = useState('')
  const [collabRole, setCollabRole] = useState<CollaboratorRole>('editor')
  const [collabError, setCollabError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  function getShareUrl(token: string) {
    return `${window.location.origin}${sharedGoalPath(token)}`
  }

  async function handleCopy(token: string) {
    await navigator.clipboard.writeText(getShareUrl(token))
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleAddCollaborator(e: React.FormEvent) {
    e.preventDefault()
    setCollabError('')
    if (!collabEmail.trim()) return
    try {
      await addCollaborator.mutateAsync({ goalId, email: collabEmail.trim(), role: collabRole })
      setCollabEmail('')
    } catch (err: unknown) {
      setCollabError(err instanceof Error ? err.message : 'Failed to add collaborator')
    }
  }

  return (
    <div className="space-y-6">
      {/* Share links */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-bold text-brand-800 mb-3">
          <Link2 size={14} />
          Share links
        </h4>

        {links.length > 0 && (
          <div className="space-y-2 mb-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded px-3 py-2">
                <span className="flex-1 text-xs text-brand-600 truncate font-mono">
                  {getShareUrl(link.token)}
                </span>
                <Badge variant={link.permission === 'edit' ? 'yellow' : 'gray'}>
                  {link.permission}
                </Badge>
                <button onClick={() => handleCopy(link.token)} className="text-brand-400 hover:text-brand-700 transition-colors">
                  {copied === link.token ? <span className="text-xs text-brand-600">Copied!</span> : <Copy size={13} />}
                </button>
                <button
                  onClick={() => revokeLink.mutate({ id: link.id, goalId })}
                  className="text-brand-300 hover:text-red-500 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <select
            value={linkPermission}
            onChange={(e) => setLinkPermission(e.target.value as SharePermission)}
            className="border border-brand-200 rounded px-2.5 py-1.5 text-sm bg-white outline-none focus:border-brand-600"
          >
            <option value="view">View only</option>
            <option value="edit">Can edit</option>
          </select>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => createLink.mutate({ goalId, permission: linkPermission })}
            loading={createLink.isPending}
          >
            <Link2 size={13} />
            Generate link
          </Button>
        </div>
      </div>

      {/* Collaborators */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-bold text-brand-800 mb-3">
          <Users size={14} />
          Collaborators
        </h4>

        {collaborators.length > 0 && (
          <div className="space-y-2 mb-3">
            {collaborators.map((c) => (
              <div key={c.user_id} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-xs font-bold text-brand-700">
                  {(c.user?.email ?? '?')[0].toUpperCase()}
                </div>
                <span className="flex-1 text-sm text-brand-700">{c.user?.email ?? c.user_id}</span>
                <Badge variant={c.role === 'owner' ? 'green' : c.role === 'editor' ? 'yellow' : 'gray'}>
                  {c.role}
                </Badge>
                {c.role !== 'owner' && (
                  <button
                    onClick={() => removeCollaborator.mutate({ goalId, userId: c.user_id })}
                    className="text-brand-300 hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddCollaborator} className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              placeholder="Email address"
              type="email"
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
              error={collabError}
            />
          </div>
          <select
            value={collabRole}
            onChange={(e) => setCollabRole(e.target.value as CollaboratorRole)}
            className="border border-brand-200 rounded px-2.5 py-2 text-sm bg-white outline-none focus:border-brand-600"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <Button size="sm" type="submit" loading={addCollaborator.isPending}>
            <UserPlus size={13} />
            Add
          </Button>
        </form>
      </div>
    </div>
  )
}
