import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  detailMap: {},
  loading: false,
  error: null,
  selectedThreadId: null,
  filterCategory: null,
};

const threadSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setThreadList(state, action) {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setThreadDetail(state, action) {
      state.detailMap[action.payload.id] = action.payload;
      state.selectedThreadId = action.payload.id;
      state.loading = false;
      state.error = null;
      // Update owner in list if the thread exists
      const threadIndex = state.list.findIndex((t) => t.id === action.payload.id);
      if (threadIndex !== -1) {
        state.list[threadIndex].owner = action.payload.owner;
      }
    },
    addThread(state, action) {
      state.list.unshift(action.payload);
    },
    setFilterCategory(state, action) {
      state.filterCategory = action.payload;
    },
    updateThreadVote(state, action) {
      const { threadId, upVotesBy, downVotesBy } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (thread) {
        thread.upVotesBy = upVotesBy;
        thread.downVotesBy = downVotesBy;
      }
      if (state.detailMap[threadId]) {
        state.detailMap[threadId].upVotesBy = upVotesBy;
        state.detailMap[threadId].downVotesBy = downVotesBy;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setThreadList,
  setThreadDetail,
  addThread,
  setFilterCategory,
  updateThreadVote,
} = threadSlice.actions;
export default threadSlice.reducer;
