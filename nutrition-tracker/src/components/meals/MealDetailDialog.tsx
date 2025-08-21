import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Chip, Typography } from '@mui/material'
import type { Meal } from '../../types/meals'

type Props = {
	open: boolean
	meal: Meal | null
	onClose: () => void
	onDelete?: (mealId: string) => void
}

export default function MealDetailDialog({ open, meal, onClose, onDelete }: Props) {
	if (!meal) return null
	const { macros } = meal
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{meal.name}</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					{meal.description && <Typography>{meal.description}</Typography>}
					<Stack direction="row" spacing={2}>
						<Macro label="Calories" value={`${macros.calories}`} />
						<Macro label="Protein" value={`${macros.protein} g`} />
						<Macro label="Carbs" value={`${macros.carbs} g`} />
						<Macro label="Fat" value={`${macros.fat} g`} />
					</Stack>
					{(meal.tags?.length ?? 0) > 0 && (
						<Stack direction="row" spacing={1}>
							{meal.tags!.map((t) => <Chip key={t} label={t} size="small" />)}
						</Stack>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				{onDelete && <Button color="error" onClick={() => onDelete(meal.id)}>Delete</Button>}
				<Button onClick={onClose} variant="contained">Close</Button>
			</DialogActions>
		</Dialog>
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