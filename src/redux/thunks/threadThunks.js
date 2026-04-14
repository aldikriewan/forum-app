import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { setThreadList, setThreadDetail, addThread } from '../slices/threadSlice';
import { setUser } from '../slices/userSlice';
import { setLoading } from '../slices/uiSlice';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async(_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Loading threads...' }));
      const response = await apiClient.get('/threads');
      const { threads } = response.data.data;
      dispatch(setThreadList(threads));
      dispatch(setLoading({ status: false }));
      return threads;
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async(threadId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Loading thread details...' }));
      const response = await apiClient.get(`/threads/${threadId}`);
      const threadDetail = response.data.data.detailThread;
      dispatch(setThreadDetail(threadDetail));
      dispatch(setUser(threadDetail.owner));
      dispatch(setLoading({ status: false }));
      return threadDetail;
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread detail');
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async({ title, body, category = '' }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Creating thread...' }));
      const response = await apiClient.post('/threads', { title, body, category });
      const newThread = response.data.data.thread;
      dispatch(addThread(newThread));
      dispatch(setLoading({ status: false }));
      return newThread;
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
    }
  },
);

export const upVoteThread = createAsyncThunk(
  'threads/upVoteThread',
  async(threadId, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/up-vote`);
      // Refresh thread detail
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to up-vote thread');
    }
  },
);

export const downVoteThread = createAsyncThunk(
  'threads/downVoteThread',
  async(threadId, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/down-vote`);
      // Refresh thread detail
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to down-vote thread');
    }
  },
);

export const neutralizeThreadVote = createAsyncThunk(
  'threads/neutralizeThreadVote',
  async(threadId, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/neutral-vote`);
      // Refresh thread detail
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to neutralize vote');
    }
  },
);
