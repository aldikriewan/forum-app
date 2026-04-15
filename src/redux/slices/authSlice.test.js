import authReducer, {
  setLoading,
  setError,
  loginSuccess,
  registerSuccess,
  logout,
} from '../../redux/slices/authSlice';

const mockLocalStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

jest.mock('../../api/apiClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('authSlice reducer', () => {
  const initialState = {
    token: null,
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const newState = authReducer(initialState, setLoading(true));
      expect(newState.loading).toBe(true);
    });

    it('should set loading state to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const newState = authReducer(stateWithLoading, setLoading(false));
      expect(newState.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const newState = authReducer(initialState, setError('Some error'));
      expect(newState.error).toBe('Some error');
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const newState = authReducer(stateWithError, setError(null));
      expect(newState.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should set token, user and isLoggedIn to true', () => {
      const payload = {
        token: 'test-token-123',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      };
      const newState = authReducer(initialState, loginSuccess(payload));

      expect(newState.token).toBe('test-token-123');
      expect(newState.user).toEqual(payload.user);
      expect(newState.isLoggedIn).toBe(true);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('should save token and user to localStorage', () => {
      const payload = {
        token: 'test-token-456',
        user: { id: '2', name: 'John Doe', email: 'john@example.com' },
      };
      authReducer(initialState, loginSuccess(payload));

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token-456');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(payload.user)
      );
    });
  });

  describe('registerSuccess', () => {
    it('should set user and clear loading/error', () => {
      const user = { id: '3', name: 'New User', email: 'new@example.com' };
      const newState = authReducer(initialState, registerSuccess(user));

      expect(newState.user).toEqual(user);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear all auth state', () => {
      const loggedInState = {
        token: 'some-token',
        user: { id: '1', name: 'Test User' },
        isLoggedIn: true,
        loading: false,
        error: null,
      };
      const newState = authReducer(loggedInState, logout());

      expect(newState.token).toBeNull();
      expect(newState.user).toBeNull();
      expect(newState.isLoggedIn).toBe(false);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('should remove token and user from localStorage', () => {
      const loggedInState = {
        token: 'some-token',
        user: { id: '1', name: 'Test User' },
        isLoggedIn: true,
        loading: false,
        error: null,
      };
      authReducer(loggedInState, logout());

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
});