import { Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts'
import { useMemo, useState } from 'react'

const daily = Array.from({ length: 7 }, (_, i) => ({ day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], cal: [2100, 1850, 2000, 2300, 1950, 2500, 1800][i] }))
const weekly = [
  { week: 'W1', cal: 14000 }, { week: 'W2', cal: 15200 }, { week: 'W3', cal: 13850 }, { week: 'W4', cal: 16020 }
]
const monthly = [
  { month: 'Jan', cal: 61200 }, { month: 'Feb', cal: 58500 }, { month: 'Mar', cal: 62000 }
]

export default function Progress() {
  const [tab, setTab] = useState<'daily'|'weekly'|'monthly'>('daily')
  const chart = useMemo(() => {
    if (tab === 'daily') return (
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daily}>
            <XAxis dataKey="day" />
            <YAxis hide domain={[0, 2800]} />
            <Tooltip />
            <Area dataKey="cal" stroke="#66bb6a" fill="#a5d6a7" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
    )
    if (tab === 'weekly') return (
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weekly}>
            <XAxis dataKey="week" />
            <YAxis hide />
            <Tooltip />
            <Line dataKey="cal" stroke="#42a5f5" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    )
    return (
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="cal" radius={[6,6,0,0]} fill="#ffcc80" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    )
  }, [tab])

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Progress</Typography>
      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Daily" value="daily" />
            <Tab label="Weekly" value="weekly" />
            <Tab label="Monthly" value="monthly" />
          </Tabs>
          {chart}
        </CardContent>
      </Card>
    </Stack>
  )
}

function ChartBox({ children, height = 260 }: { children: React.ReactNode, height?: number }) {
  return <div style={{ width: '100%', height }}>{children}</div>
}

