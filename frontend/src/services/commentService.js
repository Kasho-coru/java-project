import api from './api';

export const commentService = {
  getByHandoverId: async (handoverId) => {
    const response = await api.get(`/handovers/${handoverId}/comments`);
    return response.data;
  },
  create: async (handoverId, data) => {
    const response = await api.post(`/handovers/${handoverId}/comments`, data);
    return response.data;
  },
};

export default commentService;
