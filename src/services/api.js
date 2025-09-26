// Centralized API service for IRC – Indian Relief Connect
// - All HTTP requests go through this module
// - Uses REACT_APP_API_BASE_URL to determine the backend base URL

import axios from 'axios';

// Create a pre-configured Axios instance. This ensures consistent headers and baseURL.
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  // You can tune timeouts, withCredentials, etc. here if needed.
});

// Helper to unwrap data and normalize errors
async function requestWrapper(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    // Surface a normalized error message suitable for UI display
    const message = error?.response?.data?.message || error?.message || 'Request failed';
    const status = error?.response?.status;
    const err = new Error(message);
    err.status = status;
    throw err;
  }
}

// Endpoint 1: Get Active Alerts - GET /api/alerts
export function getAlerts() {
  return requestWrapper(apiClient.get('/api/alerts'));
}

// Endpoint 2: Get All Help Requests - GET /api/requests
export function getRequests() {
  return requestWrapper(apiClient.get('/api/requests'));
}

// Endpoint 3: Create a New Help Request - POST /api/requests
// Expects a payload shaped to the backend contract. Example structure:
// {
//   name?: string,
//   helpType: 'Food'|'Water'|'Medicine'|'Rescue'|'Shelter',
//   peopleCount: number,
//   details?: string,
//   location: { lat: number, lng: number },
//   locationName?: string
// }
export function createRequest(data) {
  return requestWrapper(apiClient.post('/api/requests', data));
}

// Endpoint 4: Update a Help Request Status - PUT /api/requests/:id
// Example body: { status: 'served' }
export function updateRequest(id, data) {
  return requestWrapper(apiClient.put(`/api/requests/${id}`, data));
}

export default {
  getAlerts,
  getRequests,
  createRequest,
  updateRequest,
};

