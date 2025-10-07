import authReducer, {
  setUser,
  setLoading,
  setError,
  clearAuth,
} from '../../store/authSlice';
import { AuthState } from '../../types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setUser', () => {
      const user = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
      };

      const actual = authReducer(initialState, setUser(user));

      expect(actual.user).toEqual(user);
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe(null);
    });

    it('should handle setUser with null', () => {
      const stateWithUser: AuthState = {
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
          emailVerified: true,
        },
        loading: false,
        error: null,
      };

      const actual = authReducer(stateWithUser, setUser(null));

      expect(actual.user).toBe(null);
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe(null);
    });

    it('should handle setLoading', () => {
      const actual = authReducer(initialState, setLoading(true));
      expect(actual.loading).toBe(true);

      const actual2 = authReducer(actual, setLoading(false));
      expect(actual2.loading).toBe(false);
    });

    it('should handle setError', () => {
      const errorMessage = 'Authentication failed';
      const actual = authReducer(initialState, setError(errorMessage));

      expect(actual.error).toBe(errorMessage);
      expect(actual.loading).toBe(false);
    });

    it('should handle setError with null', () => {
      const stateWithError: AuthState = {
        user: null,
        loading: false,
        error: 'Some error',
      };

      const actual = authReducer(stateWithError, setError(null));
      expect(actual.error).toBe(null);
    });

    it('should handle clearAuth', () => {
      const stateWithData: AuthState = {
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
          emailVerified: true,
        },
        loading: true,
        error: 'Some error',
      };

      const actual = authReducer(stateWithData, clearAuth());

      expect(actual).toEqual(initialState);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialState;

      // Start loading
      state = authReducer(state, setLoading(true));
      expect(state.loading).toBe(true);

      // Set user (should clear loading)
      const user = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
      };
      state = authReducer(state, setUser(user));
      expect(state.user).toEqual(user);
      expect(state.loading).toBe(false);

      // Clear auth
      state = authReducer(state, clearAuth());
      expect(state).toEqual(initialState);
    });

    it('should handle error scenario', () => {
      let state = initialState;

      // Start loading
      state = authReducer(state, setLoading(true));
      expect(state.loading).toBe(true);

      // Set error (should clear loading)
      const error = 'Invalid credentials';
      state = authReducer(state, setError(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(null);
    });
  });
});
