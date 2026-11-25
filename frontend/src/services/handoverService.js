import api from './api';

export const handoverService = {
  getAll: async (params) => {
    const response = await api.get('/handovers', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/handovers/${id}`);
    return response.data;
  },
  getByEmployeeId: async (employeeId) => {
    const response = await api.get(`/handovers/employee/${employeeId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/handovers', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/handovers/${id}`, data);
    return response.data;
  },
  submit: async (id) => {
    const response = await api.post(`/handovers/${id}/submit`);
    return response.data;
  },
  approve: async (id, data = {}) => {
    const response = await api.post(`/handovers/${id}/approve`, data);
    return response.data;
  },
  reject: async (id, data) => {
    // Requires mandatory reason
    const response = await api.post(`/handovers/${id}/reject`, data);
    return response.data;
  },
  accept: async (id, data = {}) => {
    const response = await api.post(`/handovers/${id}/accept`, data);
    return response.data;
  },
  requestClarification: async (id, data) => {
    // Requires clarification comments
    const response = await api.post(`/handovers/${id}/clarification`, data);
    return response.data;
  },
};

export default handoverService;
