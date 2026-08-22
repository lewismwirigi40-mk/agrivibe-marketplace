import api from './api';

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};