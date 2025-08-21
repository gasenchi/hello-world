import { Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

const meals = [
  { id: 'm1', name: 'Greek Yogurt Parfait', when: 'Breakfast', calories: 320, protein: 24, carbs: 38, fat: 8 },
  { id: 'm2', name: 'Chicken Bowl', when: 'Lunch', calories: 620, protein: 48, carbs: 55, fat: 18 },
  { id: 'm3', name: 'Apple + Almonds', when: 'Snack', calories: 240, protein: 8, carbs: 22, fat: 14 },
  { id: 'm4', name: 'Salmon + Veggies', when: 'Dinner', calories: 580, protein: 42, carbs: 30, fat: 28 },
]

export default function Meals() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Meals</Typography>

      <Card>
        <CardContent>
          <List disablePadding>
            {meals.map((m, idx) => (
              <>
                <ListItem key={m.id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>{m.name}</Typography>
                        <Chip size="small" label={m.when} />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={2}>
                        <Macro label="Cal" value={`${m.calories}`} />
                        <Macro label="P" value={`${m.protein}g`} />
                        <Macro label="C" value={`${m.carbs}g`} />
                        <Macro label="F" value={`${m.fat}g`} />
                      </Stack>
                    }
                  />
                </ListItem>
                {idx < meals.length - 1 && <Divider component="li" />}
              </>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  )
}

function Macro({ label, value }: { label: string, value: string }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography variant="body2" color="text.secondary">{label}:</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  )
}

