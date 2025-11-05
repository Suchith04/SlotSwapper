import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import Navigation from '../components/Navigation';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace';
import Requests from '../pages/Requests';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Navigation />
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/marketplace"
      element={
        <ProtectedRoute>
          <Navigation />
          <Marketplace />
        </ProtectedRoute>
      }
    />
    <Route
      path="/requests"
      element={
        <ProtectedRoute>
          <Navigation />
          <Requests />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
