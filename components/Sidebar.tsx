'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import HeadsetRoundedIcon from '@mui/icons-material/HeadsetRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useUser } from '@clerk/nextjs'
import UserSettingsModal from '@/components/UserSettingsModal'

type SidebarTab = 'home' | 'dashboard' | 'friends'

type SidebarProps = {
  active: SidebarTab
  online?: boolean
}

type UserProfileMetadata = {
  banner?: string
  bio?: string
  quote?: string
  pronouns?: string
  displayName?: string
  image?: string
}

const navItems: Array<{
  key: SidebarTab
  label: string
  href: string
  icon: ReactNode
}> = [
  { key: 'home', label: 'Home', href: '/', icon: <HomeRoundedIcon /> },
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <SpaceDashboardRoundedIcon />,
  },
  {
    key: 'friends',
    label: 'Friends',
    href: '/channels/me',
    icon: <GroupRoundedIcon />,
  },
]

export default function Sidebar({ active, online = false }: SidebarProps) {
  const { user } = useUser()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const profile = user?.publicMetadata?.profile as UserProfileMetadata | undefined
  const displayName = profile?.displayName || user?.fullName || user?.username || 'User'
  const statusText = profile?.quote || `@${user?.username || 'member'}`
  const avatarSrc = profile?.image || user?.imageUrl || undefined

  return (
    <>
      <Box
        component="aside"
        sx={(theme) => ({
          width: { xs: 88, md: 300 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#17181c' : '#e8ebf2',
          p: 1.5,
          gap: 1.5,
        })}
      >
        <Paper
          sx={(theme) => ({
            p: { xs: 1.2, md: 1.5 },
            borderRadius: 2.5,
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.2)
                : alpha(theme.palette.primary.main, 0.08),
          })}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Cordis
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            Advanced Chatting Platform
          </Typography>
        </Paper>

        <Stack spacing={1}>
          {navItems.map((item) => {
            const selected = item.key === active
            return (
              <Button
                key={item.key}
                LinkComponent={Link}
                href={item.href}
                startIcon={item.icon}
                sx={(theme) => ({
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  px: { xs: 1.2, md: 1.7 },
                  py: 1.15,
                  minWidth: 0,
                  color: selected ? '#ffffff' : theme.palette.text.secondary,
                  bgcolor: selected ? theme.palette.primary.main : 'transparent',
                  '& .MuiButton-startIcon': {
                    mr: { xs: 0, md: 1 },
                  },
                  '&:hover': {
                    bgcolor: selected
                      ? theme.palette.primary.dark
                      : alpha(theme.palette.text.primary, 0.08),
                  },
                })}
              >
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                  {item.label}
                </Box>
              </Button>
            )
          })}
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Paper
          sx={(theme) => ({
            p: 1.2,
            borderRadius: 2.5,
            bgcolor: theme.palette.mode === 'dark' ? '#2b2d31' : '#f5f6fa',
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.1}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={(theme) => ({
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    border: `2px solid ${
                      theme.palette.mode === 'dark' ? '#2b2d31' : '#f5f6fa'
                    }`,
                    bgcolor: online ? '#3BA55D' : '#747f8d',
                  })}
                />
              }
            >
              <Avatar src={avatarSrc} alt={displayName} sx={{ width: 44, height: 44 }} />
            </Badge>

            <Box sx={{ flexGrow: 1, minWidth: 0, display: { xs: 'none', md: 'block' } }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayName}
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
                {statusText}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.25}>
              <Tooltip title="Mute">
                <IconButton size="small" color="inherit">
                  <MicOffRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Audio options">
                <IconButton size="small" color="inherit">
                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Headset">
                <IconButton size="small" color="inherit">
                  <HeadsetRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Settings">
                <IconButton size="small" color="inherit" onClick={() => setSettingsOpen(true)}>
                  <SettingsRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>
      </Box>

      <UserSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
