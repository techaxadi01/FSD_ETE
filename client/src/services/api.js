import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_inno_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- AUTH API ---
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- IDEAS CRUD & SEARCH / FILTER / SORT / VOTE ---
export const getIdeas = async (params = {}) => {
  const response = await api.get('/ideas', { params });
  return response.data;
};

export const getIdeaById = async (id) => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export const createIdea = async (ideaData) => {
  const response = await api.post('/ideas', ideaData);
  return response.data;
};

export const updateIdea = async (id, ideaData) => {
  const response = await api.put(`/ideas/${id}`, ideaData);
  return response.data;
};

export const deleteIdea = async (id) => {
  const response = await api.delete(`/ideas/${id}`);
  return response.data;
};

export const voteIdea = async (id, voterId = null) => {
  const response = await api.post(`/ideas/${id}/vote`, { voterId });
  return response.data;
};

export const addComment = async (id, commentData) => {
  const response = await api.post(`/ideas/${id}/comments`, commentData);
  return response.data;
};

// --- STATS & SEED ---
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const seedDemoData = async () => {
  const response = await api.post('/seed');
  return response.data;
};

export default api;
