import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const getFloods = () => api.get('/api/floods');
export const updateFloods = () => api.put('/api/floods/update');

export const createRequest = (payload) => api.post('/api/requests', payload);
export const listRequests = () => api.get('/api/requests');

export const createSupply = (payload) => api.post('/api/supplies', payload);
export const listSupplies = () => api.get('/api/supplies');

export const runMatch = (filters = {}) => api.post('/api/match/run', filters);

export default api;
