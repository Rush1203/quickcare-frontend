import api from './axios';

export const prescriptionApi = {
  create: (data) => api.post('/prescriptions', data),
  getPatientMedicalProfile: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getMy: (params) => api.get('/prescriptions/my', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
};
