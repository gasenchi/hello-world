import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard.tsx'))
const Macros = lazy(() => import('./pages/Macros.tsx'))
const Meals = lazy(() => import('./pages/Meals.tsx'))
const History = lazy(() => import('./pages/History.tsx'))
const Progress = lazy(() => import('./pages/Progress.tsx'))
const Goals = lazy(() => import('./pages/Goals.tsx'))

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
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<App />}> 
                    <Route index element={<Suspense fallback={null}><Dashboard /></Suspense>} />
                    <Route path="macros" element={<Suspense fallback={null}><Macros /></Suspense>} />
                    <Route path="meals" element={<Suspense fallback={null}><Meals /></Suspense>} />
                    <Route path="history" element={<Suspense fallback={null}><History /></Suspense>} />
                    <Route path="progress" element={<Suspense fallback={null}><Progress /></Suspense>} />
                    <Route path="goals" element={<Suspense fallback={null}><Goals /></Suspense>} />
                  </Route>
                </Route>
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
