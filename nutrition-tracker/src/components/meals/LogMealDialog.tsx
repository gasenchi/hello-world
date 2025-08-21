import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, InputAdornment } from '@mui/material'

type Props = {
	open: boolean
	onClose: () => void
	onSave: (quantity: number, whenISO: string) => void
}

export default function LogMealDialog({ open, onClose, onSave }: Props) {
	const [quantity, setQuantity] = useState<number | ''>('')
	const [when, setWhen] = useState('')

	useEffect(() => {
		if (open) {
			setQuantity(1)
			const now = new Date()
			const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
			setWhen(local.toISOString().slice(0, 16))
		}
	}, [open])

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Log Meal</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} InputProps={{ endAdornment: <InputAdornment position="end">servings</InputAdornment> }} />
					<TextField label="When" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="inherit">Cancel</Button>
				<Button onClick={() => { if (quantity !== '' && when) onSave(Number(quantity), new Date(when).toISOString()) }} variant="contained">Log</Button>
			</DialogActions>
		</Dialog>
	)
}