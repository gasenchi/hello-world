import { Card, CardContent, LinearProgress, Stack, Typography, Box } from '@mui/material'
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'

const COLORS = ['#66bb6a', '#42a5f5', '#ff7043']

export default function Macros() {
  const targets = { calories: 2200, protein: 160, carbs: 220, fat: 70 }
  const consumed = { calories: 1280, protein: 90, carbs: 140, fat: 38 }

  const macroPie = [
    { name: 'Protein', value: consumed.protein },
    { name: 'Carbs', value: consumed.carbs },
    { name: 'Fat', value: consumed.fat },
  ]

  const week = [
    { day: 'Mon', cal: 2100 },
    { day: 'Tue', cal: 1850 },
    { day: 'Wed', cal: 2000 },
    { day: 'Thu', cal: 2300 },
    { day: 'Fri', cal: 1950 },
    { day: 'Sat', cal: 2500 },
    { day: 'Sun', cal: 1800 },
  ]

  const percent = (value: number, total: number) => Math.min(100, Math.round((value / total) * 100))

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Daily Macros</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>Calories</Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>{consumed.calories} / {targets.calories}</Typography>
              <LinearProgress variant="determinate" value={percent(consumed.calories, targets.calories)} sx={{ height: 10, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>Macro Split</Typography>
              <BoxChart>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={macroPie} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                      {macroPie.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </BoxChart>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Legend color={COLORS[0]} label={`Protein ${consumed.protein}g / ${targets.protein}g`} />
                <Legend color={COLORS[1]} label={`Carbs ${consumed.carbs}g / ${targets.carbs}g`} />
                <Legend color={COLORS[2]} label={`Fat ${consumed.fat}g / ${targets.fat}g`} />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <Box>
          <MacroCard name="Protein" value={consumed.protein} target={targets.protein} color={COLORS[0]} />
        </Box>
        <Box>
          <MacroCard name="Carbs" value={consumed.carbs} target={targets.carbs} color={COLORS[1]} />
        </Box>
        <Box>
          <MacroCard name="Fat" value={consumed.fat} target={targets.fat} color={COLORS[2]} />
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>This Week</Typography>
          <BoxChart height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week}>
                <XAxis dataKey="day" />
                <YAxis hide domain={[0, 2600]} />
                <Tooltip />
                <Bar dataKey="cal" radius={[6, 6, 0, 0]} fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </BoxChart>
        </CardContent>
      </Card>
    </Stack>
  )
}

function MacroCard({ name, value, target, color }: { name: string, value: number, target: number, color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">{name}</Typography>
        <Typography variant="h5" sx={{ mb: 1 }}>{value}g / {target}g</Typography>
        <LinearProgress variant="determinate" value={pct} sx={{ height: 10, borderRadius: 5, [`& .MuiLinearProgress-bar`]: { backgroundColor: color } }} />
      </CardContent>
    </Card>
  )
}

function Legend({ color, label }: { color: string, label: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <span style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 3, display: 'inline-block' }} />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Stack>
  )
}

function BoxChart({ children, height = 180 }: { children: React.ReactNode, height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      {children}
    </div>
  )
}

