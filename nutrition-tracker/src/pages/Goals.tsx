import { z } from 'zod'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, InputAdornment, MenuItem, Stack, TextField, Typography, Button, Alert } from '@mui/material'

const schema = z.object({
  type: z.enum(['weight_loss', 'muscle_gain', 'fitness']),
  currentWeight: z.number().min(20).max(500),
  targetWeight: z.number().min(20).max(500).optional(),
  weeklyRate: z.number().min(0.1).max(2).optional(),
  targetCalories: z.number().min(800).max(5000).optional(),
  targetProtein: z.number().min(40).max(300).optional(),
})

type FormState = z.infer<typeof schema>

const LOCAL_KEY = 'nutrition_goals_v1'

export default function Goals() {
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(() => {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      try { return schema.partial().parse(JSON.parse(raw)) as FormState } catch {}
    }
    return { type: 'fitness', currentWeight: 70, targetCalories: 2200, targetProtein: 150 }
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(form))
  }, [form])

  const onChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value === '' ? undefined : isNaN(Number(value)) ? value : Number(value) }))
  }

  const onSubmit = () => {
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {}
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState
        fieldErrors[k] = issue.message
      }
      setErrors(fieldErrors)
      setSavedMsg(null)
      return
    }
    setErrors({})
    setSavedMsg('Goals saved!')
    setTimeout(() => setSavedMsg(null), 2500)
  }

  const tips = useMemo(() => {
    if (form.type === 'weight_loss') return 'Aim for 0.25–1.0 kg loss/week. Moderate calorie deficit and high protein.'
    if (form.type === 'muscle_gain') return 'Small surplus with progressive overload. Keep protein 1.6–2.2 g/kg.'
    return 'Stay consistent. Hit calorie and protein targets. Keep active minutes up.'
  }, [form.type])

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Goals</Typography>
      {savedMsg && <Alert severity="success">{savedMsg}</Alert>}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              select
              label="Goal Type"
              value={form.type}
              onChange={(e) => onChange('type', e.target.value)}
            >
              <MenuItem value="weight_loss">Weight loss</MenuItem>
              <MenuItem value="muscle_gain">Muscle gain</MenuItem>
              <MenuItem value="fitness">General fitness</MenuItem>
            </TextField>

            <TextField
              label="Current Weight"
              type="number"
              value={form.currentWeight ?? ''}
              onChange={(e) => onChange('currentWeight', e.target.value)}
              error={!!errors.currentWeight}
              helperText={errors.currentWeight}
              InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
            />

            {form.type !== 'fitness' && (
              <>
                <TextField
                  label="Target Weight"
                  type="number"
                  value={form.targetWeight ?? ''}
                  onChange={(e) => onChange('targetWeight', e.target.value)}
                  error={!!errors.targetWeight}
                  helperText={errors.targetWeight}
                  InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                />
                <TextField
                  label="Weekly Rate"
                  type="number"
                  value={form.weeklyRate ?? ''}
                  onChange={(e) => onChange('weeklyRate', e.target.value)}
                  error={!!errors.weeklyRate}
                  helperText={errors.weeklyRate ?? (form.type === 'weight_loss' ? 'kg to lose per week' : 'kg to gain per week')}
                  InputProps={{ endAdornment: <InputAdornment position="end">kg/wk</InputAdornment> }}
                />
              </>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Daily Calories"
                type="number"
                value={form.targetCalories ?? ''}
                onChange={(e) => onChange('targetCalories', e.target.value)}
                error={!!errors.targetCalories}
                helperText={errors.targetCalories}
                InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
              />
              <TextField
                label="Daily Protein"
                type="number"
                value={form.targetProtein ?? ''}
                onChange={(e) => onChange('targetProtein', e.target.value)}
                error={!!errors.targetProtein}
                helperText={errors.targetProtein}
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">{tips}</Typography>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={onSubmit}>Save Goals</Button>
              <Button color="inherit" onClick={() => setForm({ type: 'fitness', currentWeight: 70, targetCalories: 2200, targetProtein: 150 })}>Reset</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

