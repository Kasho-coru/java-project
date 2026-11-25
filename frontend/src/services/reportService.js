import api from './api';

export const reportService = {
  getSummary: async (params) => {
    const response = await api.get('/reports/summary', { params });
    return response.data;
  },
  getDepartments: async () => {
    const response = await api.get('/reports/departments');
    return response.data;
  },
  getMonthly: async () => {
    const response = await api.get('/reports/monthly');
    return response.data;
  },
};

export default reportService;
