import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import CreateHandoverPage from './pages/CreateHandoverPage';
import AllHandoversPage from './pages/AllHandoversPage';
import HandoverDetailsPage from './pages/HandoverDetailsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MyResponsibilitiesPage from './pages/MyResponsibilitiesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Employees & Departments */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <EmployeeDirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DepartmentManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Handover Transitions */}
        <Route path="/handovers/create" element={<CreateHandoverPage />} />
        <Route path="/handovers/:id" element={<HandoverDetailsPage />} />
        <Route path="/handovers" element={<AllHandoversPage />} />

        {/* Approvals (Manager) & My Responsibilities (Receiver) */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
              <ApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-responsibilities"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN', 'MANAGER']}>
              <MyResponsibilitiesPage />
            </ProtectedRoute>
          }
        />

        {/* Reports & System Settings */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
