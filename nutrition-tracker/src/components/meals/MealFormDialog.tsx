import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import type { Meal } from '../../types/meals'

type Props = {
	open: boolean
	meal?: Meal | null
	onClose: () => void
	onSave: (meal: Meal) => void
}

export default function MealFormDialog({ open, meal, onClose, onSave }: Props) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [calories, setCalories] = useState<number | ''>('')
	const [protein, setProtein] = useState<number | ''>('')
	const [carbs, setCarbs] = useState<number | ''>('')
	const [fat, setFat] = useState<number | ''>('')
	const [tags, setTags] = useState('')

	useEffect(() => {
		if (meal) {
			setName(meal.name)
			setDescription(meal.description ?? '')
			setCalories(meal.macros.calories)
			setProtein(meal.macros.protein)
			setCarbs(meal.macros.carbs)
			setFat(meal.macros.fat)
			setTags((meal.tags ?? []).join(', '))
		} else {
			setName('')
			setDescription('')
			setCalories('')
			setProtein('')
			setCarbs('')
			setFat('')
			setTags('')
		}
	}, [meal, open])

	const handleSave = () => {
		if (!name || calories === '' || protein === '' || carbs === '' || fat === '') return
		const now = new Date().toISOString()
		onSave({
			id: meal?.id ?? crypto.randomUUID(),
			name,
			description: description || undefined,
			macros: { calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) },
			tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
			createdAt: meal?.createdAt ?? now,
			updatedAt: now,
		})
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{meal ? 'Edit Meal' : 'Create Meal'}</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
					<TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
					<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
						<TextField label="Calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))} />
						<TextField label="Protein (g)" type="number" value={protein} onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))} />
					</Stack>
					<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
						<TextField label="Carbs (g)" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))} />
						<TextField label="Fat (g)" type="number" value={fat} onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))} />
					</Stack>
					<TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="inherit">Cancel</Button>
				<Button onClick={handleSave} variant="contained">Save</Button>
			</DialogActions>
		</Dialog>
	)
}