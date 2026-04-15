import { loginUser, registerUser, getCurrentUser } from './authThunks';

import apiClient from '../../api/apiClient';

jest.mock('../../api/apiClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('authThunks', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should call API and dispatch loginSuccess on success', async() => {
      const mockResponse = {
        data: {
          data: {
            token: 'test-token-123',
          },
        },
      };
      const mockUserResponse = {
        data: {
          data: {
            user: { id: '1', name: 'Test User', email: 'test@example.com' },
          },
        },
      };

      apiClient.post.mockResolvedValueOnce(mockResponse);
      apiClient.get.mockResolvedValueOnce(mockUserResponse);

      const result = await loginUser({ email: 'test@example.com', password: 'password123' })(
        dispatch,
        () => ({}),
      );

      expect(apiClient.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(apiClient.get).toHaveBeenCalledWith('/users/me', {
        headers: { Authorization: 'Bearer test-token-123' },
      });
      expect(result.type).toBe('auth/loginUser/fulfilled');
      expect(result.payload).toEqual({
        token: 'test-token-123',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      });
    });

    it('should reject with error message on failed login', async() => {
      const error = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };
      apiClient.post.mockRejectedValue(error);

      const result = await loginUser({ email: 'wrong@example.com', password: 'wrongpass' })(
        dispatch,
        () => ({}),
      );

      expect(result.type).toBe('auth/loginUser/rejected');
      expect(result.payload).toBe('Invalid credentials');
    });

    it('should use default error message when no message provided', async() => {
      const error = {
        response: {},
      };
      apiClient.post.mockRejectedValue(error);

      const result = await loginUser({ email: 'test@example.com', password: 'password' })(
        dispatch,
        () => ({}),
      );

      expect(result.payload).toBe('Login failed');
    });
  });

  describe('registerUser', () => {
    it('should call API and return user on success', async() => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '2', name: 'New User', email: 'new@example.com' },
          },
        },
      };

      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await registerUser({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      })(dispatch, () => ({}));

      expect(apiClient.post).toHaveBeenCalledWith('/register', {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result.type).toBe('auth/registerUser/fulfilled');
      expect(result.payload).toEqual({ id: '2', name: 'New User', email: 'new@example.com' });
    });

    it('should reject with error message on failed registration', async() => {
      const error = {
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      };
      apiClient.post.mockRejectedValue(error);

      const result = await registerUser({
        name: 'Test',
        email: 'existing@example.com',
        password: 'password123',
      })(dispatch, () => ({}));

      expect(result.type).toBe('auth/registerUser/rejected');
      expect(result.payload).toBe('Email already exists');
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user and return user data', async() => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', name: 'Current User', email: 'current@example.com' },
          },
        },
      };

      apiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await getCurrentUser()(dispatch, () => ({}));

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result.type).toBe('auth/getCurrentUser/fulfilled');
      expect(result.payload).toEqual({ id: '1', name: 'Current User', email: 'current@example.com' });
    });

    it('should reject with error message on failed fetch', async() => {
      const error = {
        response: {
          data: {
            message: 'Unauthorized',
          },
        },
      };
      apiClient.get.mockRejectedValue(error);

      const result = await getCurrentUser()(dispatch, () => ({}));

      expect(result.type).toBe('auth/getCurrentUser/rejected');
      expect(result.payload).toBe('Unauthorized');
    });
  });
});
