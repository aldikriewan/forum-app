import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadItem from './ThreadItem';
import userReducer from '../../redux/slices/userSlice';
import authReducer from '../../redux/slices/authSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      users: userReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (component, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ThreadItem Component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread Title',
    body: '<p>This is the body of the test thread.</p>',
    createdAt: '2024-01-15T10:30:00.000Z',
    ownerId: 'user-1',
    totalComments: 5,
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: ['user-3'],
  };

  it('should render thread title', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
  });

  it('should render thread body (truncated)', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText(/this is the body/i)).toBeInTheDocument();
  });

  it('should render author name from users state', () => {
    const store = createTestStore({
      users: {
        users: { 'user-1': { id: 'user-1', name: 'John Doe' } },
        loading: false,
        error: null,
      },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it('should show current user as author when ownerId matches current user', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: {
        token: 'token',
        user: { id: 'user-1', name: 'Current User' },
        isLoggedIn: true,
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText(/current user/i)).toBeInTheDocument();
  });

  it('should show "Loading..." when author not found', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it('should render comment count', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/comments/i)).toBeInTheDocument();
  });

  it('should render vote counts', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    expect(screen.getByText(/👍 2/i)).toBeInTheDocument();
    expect(screen.getByText(/👎 1/i)).toBeInTheDocument();
  });

  it('should render zero votes when no votes', () => {
    const threadWithoutVotes = {
      ...mockThread,
      upVotesBy: [],
      downVotesBy: [],
    };
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={threadWithoutVotes} />, store);

    expect(screen.getByText(/👍 0/i)).toBeInTheDocument();
    expect(screen.getByText(/👎 0/i)).toBeInTheDocument();
  });

  it('should render timestamp', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    const { container } = renderWithProviders(<ThreadItem thread={mockThread} />, store);

    const timestamp = container.querySelector('.timestamp');
    expect(timestamp).toBeInTheDocument();
  });

  it('should have link to thread detail page', () => {
    const store = createTestStore({
      users: { users: {}, loading: false, error: null },
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<ThreadItem thread={mockThread} />, store);

    const link = screen.getByRole('link', { name: /test thread title/i });
    expect(link).toHaveAttribute('href', '/thread/thread-1');
  });
});