import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';
import { Loader2 } from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let data = null;
        if (currentUser?.role === 'ADMIN') {
          const res = await dashboardService.getAdminStats();
          data = res.data;
        } else if (currentUser?.role === 'MANAGER') {
          const res = await dashboardService.getManagerStats(currentUser.employeeId);
          data = res.data;
        } else {
          const res = await dashboardService.getEmployeeStats(currentUser.employeeId);
          data = res.data;
        }

        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        // In local development before Spring Boot backend is started, dashboard gracefully uses component defaults
        console.info('Backend dashboard API currently offline, using local state preview.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#426B72] animate-spin mb-3" />
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Loading dashboard metrics...
        </p>
      </div>
    );
  }

  switch (currentUser?.role) {
    case 'ADMIN':
      return <AdminDashboard stats={stats} />;
    case 'MANAGER':
      return <ManagerDashboard stats={stats} />;
    case 'EMPLOYEE':
    default:
      return <EmployeeDashboard stats={stats} currentUser={currentUser} />;
  }
};

export default DashboardPage;
