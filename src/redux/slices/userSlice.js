import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  users: {},
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
    setUser(state, action) {
      state.users[action.payload.id] = action.payload;
    },
  },
});

export const { setLoading, setError, setUsers, setCurrentUser, setUser } = userSlice.actions;
export default userSlice.reducer;
