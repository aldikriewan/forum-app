import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setUsers(state, action) {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setUsers, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
