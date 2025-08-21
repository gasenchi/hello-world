import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard.tsx'
import Macros from './pages/Macros.tsx'
import Meals from './pages/Meals.tsx'
import History from './pages/History.tsx'
import Progress from './pages/Progress.tsx'
import Goals from './pages/Goals.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#66bb6a',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}> 
              <Route index element={<Dashboard />} />
              <Route path="macros" element={<Macros />} />
              <Route path="meals" element={<Meals />} />
              <Route path="history" element={<History />} />
              <Route path="progress" element={<Progress />} />
              <Route path="goals" element={<Goals />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
