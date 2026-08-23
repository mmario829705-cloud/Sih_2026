import api from './api';

export const chatService = {
  sendMessage: (payload) => api.post('/chat', payload).then(r => r.data),
  getSessions: () => api.get('/chat/sessions').then(r => r.data),
  getSession: (id) => api.get(`/chat/sessions/${id}`).then(r => r.data),
  createSession: () => api.post('/chat/sessions').then(r => r.data),
  deleteSession: (id) => api.delete(`/chat/sessions/${id}`).then(r => r.data),
};
