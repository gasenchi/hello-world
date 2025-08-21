import { useMemo, type PropsWithChildren } from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Container, Toolbar, Typography } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = useMemo(() => {
    if (location.pathname.startsWith('/macros')) return 'macros'
    if (location.pathname.startsWith('/meals')) return 'meals'
    if (location.pathname.startsWith('/history')) return 'history'
    return 'dashboard'
  }, [location.pathname])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <AppBar position="fixed" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Nutrition
          </Typography>
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
            }
          }}
          showLabels
        >
          <BottomNavigationAction label="Dashboard" value="dashboard" icon={<HomeRoundedIcon />} />
          <BottomNavigationAction label="Macros" value="macros" icon={<PieChartRoundedIcon />} />
          <BottomNavigationAction label="Meals" value="meals" icon={<RestaurantRoundedIcon />} />
          <BottomNavigationAction label="History" value="history" icon={<HistoryRoundedIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  )
}

