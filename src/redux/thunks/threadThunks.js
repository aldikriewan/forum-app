import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import {
  setThreadList,
  setThreadDetail,
  addThread,
  toggleUpVote,
  toggleDownVote,
  toggleNeutralVote,
} from '../slices/threadSlice';
import { setUser, setUsers } from '../slices/userSlice';
import { setLoading } from '../slices/uiSlice';
import { fetchUsers } from './userThunks';

export const asyncPopulateUsersAndThreads = createAsyncThunk(
  'shared/asyncPopulateUsersAndThreads',
  async(_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Loading data...' }));

      // Fetch threads and users in parallel
      const [ threadsResponse, usersResponse ] = await Promise.all([
        apiClient.get('/threads'),
        apiClient.get('/users'),
      ]);

      const { threads } = threadsResponse.data.data;
      const { users } = usersResponse.data.data;

      dispatch(setThreadList(threads));
      dispatch(setUsers(users));
      dispatch(setLoading({ status: false }));

      return { threads, users };
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to populate data');
    }
  },
);

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
  async(threadId, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    dispatch(toggleUpVote({ threadId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/up-vote`);
    } catch (error) {
      // Rollback
      dispatch(toggleUpVote({ threadId, userId }));
      return rejectWithValue(error.response?.data?.message || 'Failed to up-vote thread');
    }
  },
);

export const downVoteThread = createAsyncThunk(
  'threads/downVoteThread',
  async(threadId, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    dispatch(toggleDownVote({ threadId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/down-vote`);
    } catch (error) {
      // Rollback
      dispatch(toggleDownVote({ threadId, userId }));
      return rejectWithValue(error.response?.data?.message || 'Failed to down-vote thread');
    }
  },
);

export const neutralizeThreadVote = createAsyncThunk(
  'threads/neutralizeThreadVote',
  async(threadId, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    // We need to keep track of current state for rollback because neutralize is not a toggle
    const { threads: { list, detailMap } } = getState();
    const thread = list.find((t) => t.id === threadId) || detailMap[threadId];
    const prevUpVotesBy = [ ...thread.upVotesBy ];
    const prevDownVotesBy = [ ...thread.downVotesBy ];

    dispatch(toggleNeutralVote({ threadId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/neutral-vote`);
    } catch (error) {
      // Rollback using the saved state
      // Actually toggleNeutralVote just removes, we need to add back if they were there
      // A better way might be a 'restoreThreadVote' action
      // Or just call the API to refresh (though that's not fully optimistic if rollback is slow)
      // Let's use a simpler approach: just call toggleNeutralVote again won't work.
      // I'll add a setThreadVote action to threadSlice.
      dispatch(fetchThreadDetail(threadId)); // Simple fallback
      return rejectWithValue(error.response?.data?.message || 'Failed to neutralize vote');
    }
  },
);
