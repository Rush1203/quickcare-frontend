import api from './axios';

export const appointmentApi = {
  book: (data) => api.post('/appointments', data),
  getMy: (params) => api.get('/appointments/my', { params }),
  getDoctorSchedule: (params) => api.get('/appointments/doctor', { params }),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  getAll: (params) => api.get('/appointments', { params }),
};
