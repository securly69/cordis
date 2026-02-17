'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import Sidebar from '@/components/Sidebar'
import { useChatSnapshot } from '@/hooks/useChatSnapshot'

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | number
  description: string
  icon: ReactNode
}) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        minHeight: 150,
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box
          sx={(theme) => ({
            width: 38,
            height: 38,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(88,101,242,0.24)'
                : 'rgba(88,101,242,0.12)',
            color: 'primary.main',
          })}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Stack>

      <Typography variant="h5" sx={{ mt: 2, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const { snapshot, loading, error, connected } = useChatSnapshot()

  const profile = user?.publicMetadata?.profile as {
    banner?: string; bio?: string; quote?: string; pronouns?: string; displayName?: string; image?: string;
  } | undefined

  const displayName = profile?.displayName || user?.fullName || user?.username || 'User'
  const imageSrc = profile?.image || user?.imageUrl || undefined
  const lastLogin = user?.lastSignInAt
    ? new Date(user.lastSignInAt).toLocaleString()
    : 'Unavailable'

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
              The dashboard is available for signed-in users only.
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
              'radial-gradient(circle at 15% 0%, rgba(88,101,242,0.18), transparent 42%), radial-gradient(circle at 88% 100%, rgba(59,165,93,0.16), transparent 42%)',
          }}
        >
          <Sidebar active="dashboard" online={connected} />

          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            <Paper
              sx={(theme) => ({
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(140deg, rgba(88,101,242,0.24) 0%, rgba(43,45,49,1) 72%)'
                    : 'linear-gradient(140deg, rgba(88,101,242,0.14) 0%, rgba(255,255,255,1) 72%)',
              })}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={imageSrc} alt={displayName} sx={{ width: 66, height: 66 }} />
                  <Box>
                    <Typography variant="h4">Welcome back, {displayName}!</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {"Find out what's happening since last time you logged in"}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    href="/channels/me"
                    startIcon={<ForumRoundedIcon />}
                  >
                    Open Friends
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Box
              sx={{
                mt: 2.2,
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              <StatCard
                title="Friends Online"
                value={loading ? '...' : snapshot.onlineFriends}
                description="Currently active friend(s) at the moment."
                icon={<GroupsRoundedIcon />}
              />

              <StatCard
                title="Unread Messages"
                value={loading ? '...' : snapshot.unreadMessages}
                description="Message(s) you have not opened yet."
                icon={<MarkChatUnreadRoundedIcon />}
              />

              <StatCard
                title="Last Login"
                value={lastLogin}
                description="Your last sign-in date and time"
                icon={<HistoryRoundedIcon />}
              />
            </Box>
          </Box>
        </Box>
      </SignedIn>
    </>
  )
}
