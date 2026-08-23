import api from './api';

export const referralService = {
  create: (payload) => api.post('/referrals', payload).then(r => r.data),
  list: () => api.get('/referrals').then(r => r.data),
  updateStatus: (id, status) => api.put(`/referrals/${id}/status`, { status }).then(r => r.data),
};

