import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell, ShellPage } from './app/AppShell';
import Dashboard from './dashboard/Dashboard';
import DailyPlanner from './planner/DailyPlanner';
import WeeklyRotation from './weekly/WeeklyRotation';
import LearningProgress from './learning/LearningProgress';
import TestingCenter from './testing/TestingCenter';
import Projects from './projects/Projects';
import { AuthProvider } from './auth/AuthContext';
import { LoginPage, RegisterPage } from './auth/AuthPages';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/today" element={<DailyPlanner />} />
              <Route path="/weekly-plan" element={<WeeklyRotation />} />
              <Route path="/learning" element={<LearningProgress />} />
              <Route path="/dsa" element={<ShellPage />} />
              <Route path="/tests" element={<TestingCenter />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analytics" element={<ShellPage />} />
              <Route path="/settings" element={<ShellPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
