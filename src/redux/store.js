import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import threadReducer from './slices/threadSlice';
import commentReducer from './slices/commentSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    threads: threadReducer,
    comments: commentReducer,
    leaderboards: leaderboardReducer,
    ui: uiReducer,
  },
});

export default store;
