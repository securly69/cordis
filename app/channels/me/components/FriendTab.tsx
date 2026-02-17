'use client'

import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { FriendPresence } from '@/hooks/useChatSnapshot'

type FriendTabProps = {
  friends: FriendPresence[]
  loading: boolean
  error: string | null
}

function formatPresence(friend: FriendPresence) {
  if (friend.online) {
    return 'Online right now'
  }

  if (!friend.lastActive) {
    return 'Offline'
  }

  return `Last seen ${new Date(friend.lastActive).toLocaleString()}`
}

export default function FriendTab({ friends, loading, error }: FriendTabProps) {
  const [query, setQuery] = useState('')

  const filteredFriends = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return friends
    return friends.filter((friend) => friend.name.toLowerCase().includes(normalized))
  }, [friends, query])

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ md: 'center' }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your friends"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Chip label={`${filteredFriends.length} listed`} size="small" />
          <Chip
            label={`${filteredFriends.filter((friend) => friend.online).length} online`}
            size="small"
            color="success"
            variant="outlined"
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack key={index} direction="row" spacing={1.25} alignItems="center">
              <Skeleton variant="circular" width={42} height={42} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="65%" />
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : filteredFriends.length > 0 ? (
        <Stack spacing={1}>
          {filteredFriends.map((friend) => (
            <Paper
              key={friend.id}
              variant="outlined"
              sx={{
                p: 1.2,
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 11,
                        height: 11,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'background.default',
                        bgcolor: friend.online ? '#3BA55D' : '#8e9297',
                      }}
                    />
                  }
                >
                  <Avatar src={friend.image} alt={friend.name} />
                </Badge>

                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {friend.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {formatPresence(friend)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No friends found for this filter yet.
        </Typography>
      )}
    </Paper>
  )
}
