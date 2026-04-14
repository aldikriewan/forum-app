import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import {
  toggleCommentUpVote,
  toggleCommentDownVote,
  toggleCommentNeutralVote,
} from '../slices/threadSlice';
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
  async({ threadId, commentId }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    dispatch(toggleCommentUpVote({ threadId, commentId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/up-vote`);
    } catch (error) {
      // Rollback
      dispatch(toggleCommentUpVote({ threadId, commentId, userId }));
      return rejectWithValue(error.response?.data?.message || 'Failed to up-vote comment');
    }
  },
);

export const downVoteComment = createAsyncThunk(
  'comments/downVoteComment',
  async({ threadId, commentId }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    dispatch(toggleCommentDownVote({ threadId, commentId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/down-vote`);
    } catch (error) {
      // Rollback
      dispatch(toggleCommentDownVote({ threadId, commentId, userId }));
      return rejectWithValue(error.response?.data?.message || 'Failed to down-vote comment');
    }
  },
);

export const neutralizeCommentVote = createAsyncThunk(
  'comments/neutralizeCommentVote',
  async({ threadId, commentId }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    const userId = auth.user.id;

    dispatch(toggleCommentNeutralVote({ threadId, commentId, userId }));

    try {
      await apiClient.post(`/threads/${threadId}/comments/${commentId}/neutral-vote`);
    } catch (error) {
      // Fallback
      dispatch(fetchThreadDetail(threadId));
      return rejectWithValue(error.response?.data?.message || 'Failed to neutralize comment vote');
    }
  },
);
