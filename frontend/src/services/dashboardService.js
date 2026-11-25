import api from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
  getManagerStats: async (managerEmployeeId) => {
    const response = await api.get('/dashboard/manager', {
      params: { managerEmployeeId }
    });
    return response.data;
  },
  getEmployeeStats: async (employeeId) => {
    const response = await api.get('/dashboard/employee', {
      params: { employeeId }
    });
    return response.data;
  },
};

export default dashboardService;
