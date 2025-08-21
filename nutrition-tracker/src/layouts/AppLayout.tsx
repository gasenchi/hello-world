import { useMemo, type PropsWithChildren } from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Container, Toolbar, Typography } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton, Avatar, Menu, MenuItem, ListItemIcon, Button } from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AppLayout({ children }: PropsWithChildren) {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, signOut } = useAuth()
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const currentTab = useMemo(() => {
		if (location.pathname.startsWith('/macros')) return 'macros'
		if (location.pathname.startsWith('/meals')) return 'meals'
		if (location.pathname.startsWith('/history')) return 'history'
		if (location.pathname.startsWith('/progress')) return 'progress'
		if (location.pathname.startsWith('/goals')) return 'goals'
		return 'dashboard'
	}, [location.pathname])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
			<AppBar position="fixed" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(8px)' }}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
						Nutrition
					</Typography>
					{user ? (
						<>
							<IconButton onClick={(e) => setAnchor(e.currentTarget)}>
								<Avatar sx={{ width: 32, height: 32 }}>{user.email?.[0]?.toUpperCase() ?? 'U'}</Avatar>
							</IconButton>
							<Menu open={!!anchor} onClose={() => setAnchor(null)} anchorEl={anchor} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
								<MenuItem onClick={() => { setAnchor(null); signOut().then(() => navigate('/login')) }}>
									<ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
									Logout
								</MenuItem>
							</Menu>
						</>
					) : (
						<Button color="inherit" onClick={() => navigate('/login')}>Log in</Button>
					)}
				</Toolbar>
			</AppBar>

			<Toolbar />
			<Container component="main" sx={{ flexGrow: 1, pb: 9, pt: 2 }}>
				{children}
			</Container>

			<Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
				<BottomNavigation
					value={currentTab}
					onChange={(_event, value) => {
						void _event
						switch (value) {
							case 'dashboard':
								navigate('/')
								break
							case 'macros':
								navigate('/macros')
								break
							case 'meals':
								navigate('/meals')
								break
							case 'history':
								navigate('/history')
								break
							case 'progress':
								navigate('/progress')
								break
							case 'goals':
								navigate('/goals')
								break
						}
					}}
					showLabels
				>
					<BottomNavigationAction label="Dashboard" value="dashboard" icon={<HomeRoundedIcon />} />
					<BottomNavigationAction label="Macros" value="macros" icon={<PieChartRoundedIcon />} />
					<BottomNavigationAction label="Meals" value="meals" icon={<RestaurantRoundedIcon />} />
					<BottomNavigationAction label="History" value="history" icon={<HistoryRoundedIcon />} />
					<BottomNavigationAction label="Progress" value="progress" icon={<TimelineRoundedIcon />} />
					<BottomNavigationAction label="Goals" value="goals" icon={<FlagRoundedIcon />} />
				</BottomNavigation>
			</Box>
		</Box>
	)
}