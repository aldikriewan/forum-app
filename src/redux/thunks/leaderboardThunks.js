import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { setLeaderboards } from '../slices/leaderboardSlice';
import { setLoading } from '../slices/uiSlice';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async(_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Loading leaderboards...' }));
      const response = await apiClient.get('/leaderboards');
      const { leaderboards } = response.data.data;
      dispatch(setLeaderboards(leaderboards));
      dispatch(setLoading({ status: false }));
      return leaderboards;
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboards');
    }
  },
);
