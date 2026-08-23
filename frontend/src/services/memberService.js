import api from './api';

export const memberService = {
  updateProfile: (payload) => api.put('/members/profile', payload).then(r => r.data),
  deleteProfile: () => api.delete('/members/profile').then(r => r.data),
};
