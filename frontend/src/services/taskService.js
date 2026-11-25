import api from './api';

export const taskService = {
  getByHandoverId: async (handoverId) => {
    const response = await api.get(`/handovers/${handoverId}/tasks`);
    return response.data;
  },
  create: async (handoverId, data) => {
    const response = await api.post(`/handovers/${handoverId}/tasks`, data);
    return response.data;
  },
  update: async (taskId, data) => {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data;
  },
  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

export default taskService;
