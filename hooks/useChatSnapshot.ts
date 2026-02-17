'use client'

import { useCallback, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useStreamConnect } from '@/hooks/useStreamConnect'

export type FriendPresence = {
  id: string
  name: string
  image?: string
  online: boolean
  lastActive: string | null
  channelCount: number
}

type ChatSnapshot = {
  onlineFriends: number
  unreadMessages: number
  totalFriends: number
  friends: FriendPresence[]
}

const defaultSnapshot: ChatSnapshot = {
  onlineFriends: 0,
  unreadMessages: 0,
  totalFriends: 0,
  friends: [],
}

function pickLatestTimestamp(first: string | null, second: string | null) {
  if (!first) return second
  if (!second) return first
  return new Date(first).getTime() >= new Date(second).getTime() ? first : second
}

export function useChatSnapshot() {
  const { user } = useUser()
  const { client, connected } = useStreamConnect()
  const [snapshot, setSnapshot] = useState<ChatSnapshot>(defaultSnapshot)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const refresh = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!client || !user?.id || !connected) return false

    if (!silent) {
      setLoading(true)
    }

    let loaded = false
    try {
      const channels = await client.queryChannels(
        { members: { $in: [user.id] } } as never,
        { last_message_at: -1 } as never,
        { state: true, watch: false, presence: true, limit: 50 }
      )

      let unreadMessages = 0
      const friendMap = new Map<string, FriendPresence>()

      channels.forEach((channel) => {
        unreadMessages += channel.countUnread()

        Object.values(channel.state.members).forEach((member) => {
          const memberUser = member?.user as
            | {
              id?: string
              name?: string
              image?: string
              online?: boolean
              last_active?: string | Date
            }
            | undefined

          if (!memberUser?.id || memberUser.id === user.id) return

          const friendId = memberUser.id
          const incomingLastActive = memberUser.last_active
            ? new Date(memberUser.last_active).toISOString()
            : null
          const incoming: FriendPresence = {
            id: friendId,
            name: memberUser.name || friendId,
            image: memberUser.image,
            online: Boolean(memberUser.online),
            lastActive: incomingLastActive,
            channelCount: 1,
          }

          const existing = friendMap.get(friendId)
          if (!existing) {
            friendMap.set(friendId, incoming)
            return
          }

          friendMap.set(friendId, {
            id: friendId,
            name: existing.name !== existing.id ? existing.name : incoming.name,
            image: existing.image || incoming.image,
            online: existing.online || incoming.online,
            lastActive: pickLatestTimestamp(existing.lastActive, incoming.lastActive),
            channelCount: existing.channelCount + 1,
          })
        })
      })

      const friends = Array.from(friendMap.values()).sort((a, b) => {
        if (a.online !== b.online) {
          return a.online ? -1 : 1
        }
        const aTime = a.lastActive ? new Date(a.lastActive).getTime() : 0
        const bTime = b.lastActive ? new Date(b.lastActive).getTime() : 0
        return bTime - aTime
      })

      setSnapshot({
        onlineFriends: friends.filter((friend) => friend.online).length,
        unreadMessages,
        totalFriends: friends.length,
        friends,
      })
      setError(null)
      if (!hasLoadedOnce) {
        setHasLoadedOnce(true)
      }
      loaded = true
    } catch {
      // Keep previously loaded stats and avoid flashing errors on transient refresh failures.
      if (!hasLoadedOnce) {
        setError('Could not load live chat stats.')
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
    return loaded
  }, [client, user?.id, connected, hasLoadedOnce])

  useEffect(() => {
    if (!client || !user?.id || !connected) return

    let cancelled = false
    const load = async (silent = false) => {
      if (cancelled) return
      const loaded = await refresh({ silent })
      if (!loaded && !silent) {
        // One quick retry makes initial loads more stable while Stream settles.
        await new Promise((resolve) => window.setTimeout(resolve, 900))
        if (!cancelled) {
          await refresh({ silent: false })
        }
      }
    }

    void load(false)

    // Listen for immediate events that should trigger a refresh
    const listener = client.on((event) => {
      const types = [
        'user.presence.changed',
        'user.updated',
        'message.new',
        'notification.message_new',
        'message.read',
        'notification.mark_read',
      ]
      if (types.includes(event.type)) {
        void load(true)
      }
    })

    const interval = window.setInterval(() => {
      void load(true)
    }, 45000)

    return () => {
      cancelled = true
      listener.unsubscribe()
      window.clearInterval(interval)
    }
  }, [client, refresh, user?.id, connected])

  return { snapshot, loading, error, connected, refresh }
}
