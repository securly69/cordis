'use client'

import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import Sidebar from '@/components/Sidebar'
import FriendTab from '@/app/channels/me/components/FriendTab'
import { useChatSnapshot } from '@/hooks/useChatSnapshot'

export default function FriendsPage() {
  const { user } = useUser()
  const { snapshot, loading, error, connected } = useChatSnapshot()

  const profile = user?.publicMetadata?.profile as {
    banner?: string; bio?: string; quote?: string; pronouns?: string; displayName?: string; image?: string;
  } | undefined

  const displayName = profile?.displayName || user?.fullName || user?.username || 'User'
  const imageSrc = profile?.image || user?.imageUrl || undefined

  return (
    <>
      <SignedOut>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            p: 3,
          }}
        >
          <Paper sx={{ p: 3, maxWidth: 420 }}>
            <Typography variant="h5" fontWeight={800}>
              Sign in required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.1, mb: 2.5 }}>
              Your friends list is only available for signed-in users.
            </Typography>
            <SignInButton mode="modal">
              <Button variant="contained">Sign In</Button>
            </SignInButton>
          </Paper>
        </Box>
      </SignedOut>

      <SignedIn>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            background:
              'radial-gradient(circle at 75% 5%, rgba(88,101,242,0.16), transparent 40%), radial-gradient(circle at 5% 95%, rgba(59,165,93,0.13), transparent 45%)',
          }}
        >
          <Sidebar active="friends" online={connected} />

          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            <Paper
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar src={imageSrc} alt={displayName} />
                  <Box>
                    <Typography variant="h5">Friends</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your connections
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`${snapshot.onlineFriends} online`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label={`${snapshot.unreadMessages} messages unread`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Paper>

            <Box sx={{ mt: 2 }}>
              <FriendTab friends={snapshot.friends} loading={loading} error={error} />
            </Box>
          </Box>
        </Box>
      </SignedIn>
    </>
  )
}
