import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      const { token } = response.data.data;

      // Fetch current user info
      const userResponse = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user } = userResponse.data.data;

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/register', { name, email, password });
      const { user } = response.data.data;
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async(_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
    }
  },
);
