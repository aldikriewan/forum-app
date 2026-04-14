import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { fetchThreadDetail } from './threadThunks';
import { setLoading } from '../slices/uiSlice';

export const createComment = createAsyncThunk(
  'comments/createComment',
  async({ threadId, content }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ status: true, text: 'Creating comment...' }));
      const response = await apiClient.post(`/threads/${threadId}/comments`, { content });
      dispatch(setLoading({ status: false }));
      // Refresh thread detail to get updated comments
      dispatch(fetchThreadDetail(threadId));
      return response.data.data.comment;
    } catch (error) {
      dispatch(setLoading({ status: false }));
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  },
);

export const upVoteComment = createAsyncThunk(
  'comments/upVoteComment',
  async({ threadId, commentId }, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/up-vote`);
      // Refresh thread detail to get updated votes
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to up-vote comment');
    }
  },
);

export const downVoteComment = createAsyncThunk(
  'comments/downVoteComment',
  async({ threadId, commentId }, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/down-vote`);
      // Refresh thread detail to get updated votes
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to down-vote comment');
    }
  },
);

export const neutralizeCommentVote = createAsyncThunk(
  'comments/neutralizeCommentVote',
  async({ threadId, commentId }, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/neutral-vote`);
      // Refresh thread detail to get updated votes
      dispatch(fetchThreadDetail(threadId));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to neutralize comment vote');
    }
  },
);
