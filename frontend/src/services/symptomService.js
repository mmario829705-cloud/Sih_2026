import api from './api';

export const symptomAssessmentService = {
  assess: (payload) => api.post('/symptoms/assess', payload).then(r => r.data),
  getHistory: (page = 1, limit = 10) =>
    api.get('/symptoms/history', { params: { page, limit } }).then(r => r.data),
  getById: (id) => api.get(`/symptoms/${id}`).then(r => r.data),
};
