import { Alert, Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const redirectTo = location.state?.from ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onLogin = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    navigate(redirectTo, { replace: true })
  }

  const onGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (error) setError(error.message)
  }

  return (
    <Stack alignItems="center" sx={{ mt: 6 }}>
      <Card sx={{ width: 400, maxWidth: '100%' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>Log in</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={onLogin}>Continue</Button>
            <Divider>or</Divider>
            <Button variant="outlined" onClick={onGoogle}>Continue with Google</Button>
            <Box>
              <Typography variant="body2">No account? <RouterLink to="/signup">Sign up</RouterLink></Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

