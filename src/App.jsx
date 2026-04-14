import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/common/Header';
import LoadingIndicator from './components/common/LoadingIndicator';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import './App.css';

// Forum Diskusi App with Redux State Management
function AppContent() {
  return (
    <Router>
      <Header />
      <LoadingIndicator />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thread/:threadId" element={<ThreadDetailPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <React.StrictMode>
      <Provider
        store={store}
      >
        <AppContent />
      </Provider>
    </React.StrictMode>
  );
}

export default App;
