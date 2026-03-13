import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Overview from './pages/DashboardViews/Overview';
import Generator from './pages/DashboardViews/Generator';
import Projects from './pages/DashboardViews/Projects';
import Settings from './pages/DashboardViews/Settings';
import BuilderLayout from './pages/Builder/BuilderLayout';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          >
            <Route index element={<Overview />} />
            <Route path="generate" element={<Navigate to="/builder" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route 
            path="/builder" 
            element={
              <PrivateRoute>
                <BuilderLayout />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/builder/:projectId" 
            element={
              <PrivateRoute>
                <BuilderLayout />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
