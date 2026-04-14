import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  loadingText: 'Loading...',
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload.status;
      state.loadingText = action.payload.text || 'Loading...';
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const { setLoading, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
