import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLeaderboards(state, action) {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setLeaderboards } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
