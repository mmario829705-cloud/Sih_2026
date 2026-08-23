import api from './api';

export const phcService = {
  list: (params = {}) => api.get('/phcs', { params }).then(r => r.data),
};
