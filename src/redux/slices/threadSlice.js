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
    toggleUpVote(state, action) {
      const { threadId, userId } = action.payload;
      const update = (thread) => {
        if (thread.upVotesBy.includes(userId)) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        } else {
          thread.upVotesBy.push(userId);
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        }
      };
      const threadInList = state.list.find((t) => t.id === threadId);
      if (threadInList) update(threadInList);
      if (state.detailMap[threadId]) update(state.detailMap[threadId]);
    },
    toggleDownVote(state, action) {
      const { threadId, userId } = action.payload;
      const update = (thread) => {
        if (thread.downVotesBy.includes(userId)) {
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        } else {
          thread.downVotesBy.push(userId);
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        }
      };
      const threadInList = state.list.find((t) => t.id === threadId);
      if (threadInList) update(threadInList);
      if (state.detailMap[threadId]) update(state.detailMap[threadId]);
    },
    toggleNeutralVote(state, action) {
      const { threadId, userId } = action.payload;
      const update = (thread) => {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      };
      const threadInList = state.list.find((t) => t.id === threadId);
      if (threadInList) update(threadInList);
      if (state.detailMap[threadId]) update(state.detailMap[threadId]);
    },
    toggleCommentUpVote(state, action) {
      const { threadId, commentId, userId } = action.payload;
      const thread = state.detailMap[threadId];
      if (thread && thread.comments) {
        const comment = thread.comments.find((c) => c.id === commentId);
        if (comment) {
          if (comment.upVotesBy.includes(userId)) {
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          } else {
            comment.upVotesBy.push(userId);
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          }
        }
      }
    },
    toggleCommentDownVote(state, action) {
      const { threadId, commentId, userId } = action.payload;
      const thread = state.detailMap[threadId];
      if (thread && thread.comments) {
        const comment = thread.comments.find((c) => c.id === commentId);
        if (comment) {
          if (comment.downVotesBy.includes(userId)) {
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          } else {
            comment.downVotesBy.push(userId);
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          }
        }
      }
    },
    toggleCommentNeutralVote(state, action) {
      const { threadId, commentId, userId } = action.payload;
      const thread = state.detailMap[threadId];
      if (thread && thread.comments) {
        const comment = thread.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        }
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
  toggleUpVote,
  toggleDownVote,
  toggleNeutralVote,
  toggleCommentUpVote,
  toggleCommentDownVote,
  toggleCommentNeutralVote,
} = threadSlice.actions;
export default threadSlice.reducer;
