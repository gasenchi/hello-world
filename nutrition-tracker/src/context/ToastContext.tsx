import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { Alert, Button, Snackbar } from '@mui/material'

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning'

type ToastState = {
	open: boolean
	message: string
	severity: ToastSeverity
	actionLabel?: string
	onAction?: () => void
}

const ToastContext = createContext({
	success: (_msg: string) => {},
	error: (_msg: string) => {},
	info: (_msg: string) => {},
	undo: (_msg: string, _onUndo: () => void) => {},
})

export function ToastProvider({ children }: PropsWithChildren) {
	const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'info' })

	const close = useCallback(() => setToast((t) => ({ ...t, open: false })), [])

	const api = useMemo(() => ({
		success: (message: string) => setToast({ open: true, message, severity: 'success' }),
		error: (message: string) => setToast({ open: true, message, severity: 'error' }),
		info: (message: string) => setToast({ open: true, message, severity: 'info' }),
		undo: (message: string, onUndo: () => void) => setToast({ open: true, message, severity: 'info', actionLabel: 'Undo', onAction: onUndo }),
	}), [])

	return (
		<ToastContext.Provider value={api}>
			{children}
			<Snackbar open={toast.open} autoHideDuration={4000} onClose={close} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert onClose={close} severity={toast.severity} variant="filled" action={toast.actionLabel ? (
					<Button size="small" color="inherit" onClick={() => { toast.onAction?.(); close() }}>{toast.actionLabel}</Button>
				) : undefined}>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	)
}

export function useToast() {
	return useContext(ToastContext)
}