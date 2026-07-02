import api from './axios';

export const aiApi = {
  chat: (message) => api.post('/ai/chat', { message }),
};
