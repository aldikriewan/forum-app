import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from './LoginForm';
import authReducer from '../../redux/slices/authSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
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

describe('LoginForm Component', () => {
  it('should render login form with all elements', () => {
    // Skenario: Komponen LoginForm menampilkan form login lengkap dengan input email, password, dan tombol submit
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should show error for invalid email format', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
  });

  it('should show error for short password', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('should display loading state when submitting', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: true, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('should display error from Redux state', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: 'Invalid credentials' },
    });

    renderWithProviders(<LoginForm />, store);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('should have link to register page', () => {
    const store = createTestStore({
      auth: { token: null, user: null, isLoggedIn: false, loading: false, error: null },
    });

    renderWithProviders(<LoginForm />, store);

    const registerLink = screen.getByRole('link', { name: /register here/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});