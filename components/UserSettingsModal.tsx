'use client'

import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { UploadButton } from '@/lib/uploadthing'
import { ThemeMode, useAppThemeMode } from '@/components/theme-provider'
import '@uploadthing/react/styles.css'

type UserSettingsModalProps = {
  open: boolean
  onClose: () => void
}

type AvatarType = 'clerk' | 'stream' | 'custom'

type UserProfileMetadata = {
  banner?: string
  bio?: string
  quote?: string
  pronouns?: string
  displayName?: string
  image?: string
}

const avatarModes: AvatarType[] = ['clerk', 'stream', 'custom']
const themeModes: ThemeMode[] = ['dark', 'light', 'system']
const avatarModeLabel: Record<AvatarType, string> = {
  clerk: 'Clerk',
  stream: 'Stream',
  custom: 'Custom',
}
const themeModeLabel: Record<ThemeMode, string> = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
}

function getAvatarType(avatarUrl: string): AvatarType {
  if (!avatarUrl) return 'clerk'
  if (avatarUrl.includes('clerk.com') || avatarUrl.includes('img.clerk.com')) return 'clerk'
  if (avatarUrl.includes('getstream.io/random_png')) return 'stream'
  return 'custom'
}

export default function UserSettingsModal({ open, onClose }: UserSettingsModalProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { themeMode, setThemeMode } = useAppThemeMode()

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [quote, setQuote] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [banner, setBanner] = useState('')
  const [customAvatar, setCustomAvatar] = useState('')
  const [avatarType, setAvatarType] = useState<AvatarType>('clerk')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !isLoaded || !user) return

    const profile = (user.publicMetadata?.profile as UserProfileMetadata | undefined) ?? {}
    const currentAvatar = profile.image || user.imageUrl || ''

    setDisplayName(profile.displayName || user.fullName || user.username || '')
    setBio(profile.bio || '')
    setQuote(profile.quote || '')
    setPronouns(profile.pronouns || '')
    setBanner(profile.banner || '')
    setAvatarType(getAvatarType(currentAvatar))
    setCustomAvatar(getAvatarType(currentAvatar) === 'custom' ? currentAvatar : '')
    setError(null)
  }, [open, isLoaded, user])

  const avatar = useMemo(() => {
    if (!user) return ''

    if (avatarType === 'custom') {
      return customAvatar || user.imageUrl
    }

    if (avatarType === 'stream') {
      const letter = displayName.trim()[0]?.toUpperCase() || 'U'
      return `https://getstream.io/random_png/?name=${letter}`
    }

    return user.imageUrl
  }, [avatarType, customAvatar, user, displayName])

  const saveChanges = async () => {
    if (!user || loading || !displayName.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          image: avatar,
          bio: bio.trim(),
          quote: quote.trim(),
          pronouns: pronouns.trim(),
          banner: banner.trim(),
        }),
      })

      const payload = (await res.json().catch(() => null)) as { error?: string } | null

      if (!res.ok) {
        throw new Error(payload?.error || 'Unable to save profile updates.')
      }

      router.refresh()
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save profile updates.')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || !user) return null

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Typography variant="h5" component="h2">
          User Settings
        </Typography>
        <Typography variant="body2" component="p" color="text.secondary">
          Manage your profile card and dashboard appearance.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'divider' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1.2fr 1fr',
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Profile
            </Typography>

            <Box
              sx={{
                mt: 1.5,
                mb: 7,
                position: 'relative',
                height: 148,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'action.hover',
              }}
            >
              {banner ? (
                <Image src={banner} alt="Banner preview" fill className="object-cover" />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    background:
                      'linear-gradient(120deg, rgba(88,101,242,0.36) 0%, rgba(59,165,93,0.20) 100%)',
                  }}
                />
              )}

              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <UploadButton
                  endpoint="bannerUploader"
                  onClientUploadComplete={(res) => setBanner(res[0].url)}
                  appearance={{
                    button:
                      'bg-[#111827] hover:bg-[#0f172a] text-white text-xs px-3 py-2 rounded-md h-auto after:bg-none',
                    allowedContent: 'hidden',
                  }}
                  content={{ button: 'Upload Banner' }}
                />
              </Box>

              <Avatar
                src={avatar || undefined}
                alt="Profile image"
                sx={{
                  width: 96,
                  height: 96,
                  position: 'absolute',
                  left: 18,
                  bottom: -42,
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              />
            </Box>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                  Avatar Source
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  color="primary"
                  exclusive
                  value={avatarType}
                  onChange={(_, value: AvatarType | null) => {
                    if (value) setAvatarType(value)
                  }}
                  fullWidth
                >
                  {avatarModes.map((mode) => (
                    <ToggleButton key={mode} value={mode} sx={{ textTransform: 'none' }}>
                      {avatarModeLabel[mode]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {avatarType === 'custom' && (
                  <Box sx={{ mt: 1.25 }}>
                    <UploadButton
                      endpoint="avatarUploader"
                      onClientUploadComplete={(res) => setCustomAvatar(res[0].url)}
                      appearance={{
                        button:
                          'bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-medium px-4 py-2 rounded h-auto w-auto transition',
                        allowedContent: 'hidden',
                      }}
                      content={{ button: 'Upload Avatar' }}
                    />
                  </Box>
                )}
              </Box>

              <TextField
                label="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                fullWidth
                required
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  label="Pronouns"
                  value={pronouns}
                  onChange={(event) => setPronouns(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Status / Quote"
                  value={quote}
                  onChange={(event) => setQuote(event.target.value)}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Appearance
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.25 }}>
              Pick which theme mode should drive the whole app.
            </Typography>

            <ToggleButtonGroup
              color="primary"
              exclusive
              value={themeMode}
              onChange={(_, value: ThemeMode | null) => {
                if (value) setThemeMode(value)
              }}
              fullWidth
            >
              {themeModes.map((mode) => (
                <ToggleButton key={mode} value={mode} sx={{ textTransform: 'none' }}>
                  {themeModeLabel[mode]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 1.5,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                Theme
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                This preference updates the theme for every page.
              </Typography>
            </Paper>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={700}>
              Account
            </Typography>

            <Stack spacing={0.75} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Username: @{user.username || 'unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {user.primaryEmailAddress?.emailAddress || 'Unavailable'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last login:{' '}
                {user.lastSignInAt
                  ? new Date(user.lastSignInAt).toLocaleString()
                  : 'Unavailable'}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={saveChanges}
          disabled={loading || !displayName.trim()}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
