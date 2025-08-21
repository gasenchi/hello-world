import { Card, CardContent, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { Meal, MealLog } from '../types/meals'
import { storage } from '../services/storage'

export default function History() {
	const [logs, setLogs] = useState<MealLog[]>([])
	const [meals, setMeals] = useState<Meal[]>([])
	useEffect(() => {
		setLogs(storage.getLogs())
		setMeals(storage.getMeals())
	}, [])

	const items = useMemo(() => logs.map((l) => {
		const meal = meals.find((m) => m.id === l.mealId)
		const date = new Date(l.when).toLocaleString()
		const title = meal ? `${meal.name} × ${l.quantity}` : `Meal × ${l.quantity}`
		return { id: l.id, title, date, calories: l.macros.calories }
	}), [logs, meals])

	return (
		<Stack spacing={2}>
			<Typography variant="h5" fontWeight={700}>History</Typography>
			<Card>
				<CardContent>
					<List disablePadding>
						{items.map((h) => (
							<ListItem key={h.id} sx={{ px: 0 }}>
								<ListItemText
									primary={<Typography variant="subtitle1" fontWeight={600}>{h.title}</Typography>}
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

