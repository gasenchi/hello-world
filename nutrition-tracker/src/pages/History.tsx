import { Card, CardContent, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

const history = [
  { id: 'h1', date: '2025-08-18', action: 'Scanned barcode: Oats', calories: 150 },
  { id: 'h2', date: '2025-08-18', action: 'Uploaded photo: Salad Bowl', calories: 420 },
  { id: 'h3', date: '2025-08-17', action: 'Added manual: Protein Shake', calories: 220 },
]

export default function History() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>History</Typography>
      <Card>
        <CardContent>
          <List disablePadding>
            {history.map((h) => (
              <ListItem key={h.id} sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="subtitle1" fontWeight={600}>{h.action}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{h.date} • {h.calories} kcal</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  )
}

