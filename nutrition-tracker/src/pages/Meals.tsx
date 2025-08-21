import { Card, CardContent, Chip, Divider, IconButton, List, ListItem, ListItemText, Stack, Typography, Button, Tooltip } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import type { Meal } from '../types/meals'
import MealFormDialog from '../components/meals/MealFormDialog'
import MealDetailDialog from '../components/meals/MealDetailDialog'
import LogMealDialog from '../components/meals/LogMealDialog'
import { useMeals } from '../hooks/useMeals'
import { mockGenerateMeals } from '../services/generator'
import { useState } from 'react'

export default function Meals() {
	const { meals, upsertMeal, deleteMeal, logMeal, todayTotals } = useMeals()
	const [openForm, setOpenForm] = useState(false)
	const [editing, setEditing] = useState<Meal | null>(null)
	const [openDetail, setOpenDetail] = useState(false)
	const [detailMeal, setDetailMeal] = useState<Meal | null>(null)
	const [openLog, setOpenLog] = useState(false)
	const [logTarget, setLogTarget] = useState<Meal | null>(null)

	const createNew = () => { setEditing(null); setOpenForm(true) }
	const onSaveMeal = (meal: Meal) => { upsertMeal(meal); setOpenForm(false) }

	const onQuickGenerate = () => {
		// In future, pull real goal; use 'fitness' now
		const generated = mockGenerateMeals('fitness', 3)
		generated.forEach((m: Meal) => upsertMeal(m))
	}

	return (
		<Stack spacing={2}>
			<Typography variant="h5" fontWeight={700}>Meals</Typography>

			<Card>
				<CardContent>
					<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1} sx={{ mb: 1 }}>
						<Stack direction="row" spacing={2}>
							<Macro label="Cal" value={`${todayTotals.calories}`} />
							<Macro label="P" value={`${todayTotals.protein}g`} />
							<Macro label="C" value={`${todayTotals.carbs}g`} />
							<Macro label="F" value={`${todayTotals.fat}g`} />
						</Stack>
						<Stack direction="row" spacing={1}>
							<Button startIcon={<AddRoundedIcon />} variant="contained" onClick={createNew}>New</Button>
							<Button startIcon={<BoltRoundedIcon />} onClick={onQuickGenerate}>Generate</Button>
						</Stack>
					</Stack>

					<List disablePadding>
						{meals.map((m: Meal, idx: number) => (
							<>
								<ListItem key={m.id} alignItems="flex-start" sx={{ px: 0 }} secondaryAction={
									<Stack direction="row" spacing={0.5}>
										<Tooltip title="View">
											<IconButton onClick={() => { setDetailMeal(m); setOpenDetail(true) }}>
												<PlayArrowRoundedIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Log">
											<IconButton onClick={() => { setLogTarget(m); setOpenLog(true) }}>
												<BoltRoundedIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Edit">
											<IconButton onClick={() => { setEditing(m); setOpenForm(true) }}>
												<EditRoundedIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete">
											<IconButton color="error" onClick={() => deleteMeal(m.id)}>
												<DeleteRoundedIcon />
											</IconButton>
										</Tooltip>
									</Stack>
								}>
									<ListItemText
										primary={
											<Stack direction="row" spacing={1} alignItems="center">
												<Typography variant="subtitle1" fontWeight={600}>{m.name}</Typography>
												{(m.tags ?? []).slice(0, 2).map((t: string) => <Chip key={t} size="small" label={t} />)}
											</Stack>
										}
										secondary={
											<Stack direction="row" spacing={2}>
												<Macro label="Cal" value={`${m.macros.calories}`} />
												<Macro label="P" value={`${m.macros.protein}g`} />
												<Macro label="C" value={`${m.macros.carbs}g`} />
												<Macro label="F" value={`${m.macros.fat}g`} />
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

			<MealFormDialog open={openForm} meal={editing} onClose={() => setOpenForm(false)} onSave={onSaveMeal} />
			<MealDetailDialog open={openDetail} meal={detailMeal} onClose={() => setOpenDetail(false)} onDelete={(id) => { deleteMeal(id); setOpenDetail(false) }} />
			<LogMealDialog open={openLog} onClose={() => setOpenLog(false)} onSave={(quantity, whenISO) => { if (logTarget) { logMeal(logTarget, quantity, whenISO); setOpenLog(false) } }} />
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

