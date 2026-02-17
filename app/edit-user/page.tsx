'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Box, Button, Paper, Typography } from '@mui/material'
import UserSettingsModal from '@/components/UserSettingsModal'

export default function EditProfilePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    router.replace('/dashboard')
  }

  return (
    <>
      <SignedIn>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <UserSettingsModal open={open} onClose={handleClose} />
        </Box>
      </SignedIn>

      <SignedOut>
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
          <Paper sx={{ p: 3, maxWidth: 420 }}>
            <Typography variant="h5" fontWeight={800}>
              Sign in required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.1, mb: 2.5 }}>
              Sign in to open user settings.
            </Typography>
            <SignInButton mode="modal">
              <Button variant="contained">Sign In</Button>
            </SignInButton>
          </Paper>
        </Box>
      </SignedOut>
    </>
  )
}
