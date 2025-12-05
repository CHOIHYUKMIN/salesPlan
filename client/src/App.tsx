import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import YearPlanListPage from './pages/YearPlanListPage'
import YearPlanFormPage from './pages/YearPlanFormPage'
import YearPlanDetailPage from './pages/YearPlanDetailPage'
import MonthPlanListPage from './pages/MonthPlanListPage'
import MonthPlanFormPage from './pages/MonthPlanFormPage'
import MonthPlanDetailPage from './pages/MonthPlanDetailPage'
import Layout from './components/Layout'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />

                        {/* Year Plan Routes */}
                        <Route path="/year-plans" element={<YearPlanListPage />} />
                        <Route path="/year-plans/new" element={<YearPlanFormPage />} />
                        <Route path="/year-plans/:id" element={<YearPlanDetailPage />} />
                        <Route path="/year-plans/:id/edit" element={<YearPlanFormPage />} />

                        {/* Month Plan Routes */}
                        <Route path="/month-plans" element={<MonthPlanListPage />} />
                        <Route path="/month-plans/new" element={<MonthPlanFormPage />} />
                        <Route path="/month-plans/:id" element={<MonthPlanDetailPage />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
