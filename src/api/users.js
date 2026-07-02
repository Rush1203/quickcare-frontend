import api from './axios';

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDoctors: (params) => api.get('/users/doctors', { params }),
  getPatients: (params) => api.get('/users/patients', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  toggleStatus: (id) => api.patch(`/users/${id}/status`),
};
