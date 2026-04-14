import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { setUser, setUsers } from '../slices/userSlice';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async(_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users');
      const { users } = response.data.data;
      dispatch(setUsers(users));
      return users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  },
);

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async(id, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      const { user } = response.data.data;
      dispatch(setUser(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  },
);
