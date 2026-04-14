import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addCommentToThread(state) {
      // This will be handled by updating the thread detail in threadSlice
      state.loading = false;
      state.error = null;
    },
    updateCommentVote(state) {
      // This will be handled by updating the thread detail in threadSlice
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, addCommentToThread, updateCommentVote } = commentSlice.actions;
export default commentSlice.reducer;
