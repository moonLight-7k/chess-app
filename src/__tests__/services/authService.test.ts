import { mapFirebaseUser } from '../../services/authService';
import { User as FirebaseUser } from 'firebase/auth';

describe('authService', () => {
  describe('mapFirebaseUser', () => {
    it('should correctly map Firebase user to app User type', () => {
      const mockFirebaseUser: FirebaseUser = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        metadata: {
          creationTime: '2024-01-01T00:00:00.000Z',
          lastSignInTime: '2024-01-02T00:00:00.000Z',
        },
      } as FirebaseUser;

      const result = mapFirebaseUser(mockFirebaseUser);

      expect(result).toEqual({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should handle null values correctly', () => {
      const mockFirebaseUser: FirebaseUser = {
        uid: 'test-uid-456',
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        metadata: {
          creationTime: '2024-01-01T00:00:00.000Z',
          lastSignInTime: '2024-01-02T00:00:00.000Z',
        },
      } as FirebaseUser;

      const result = mapFirebaseUser(mockFirebaseUser);

      expect(result).toEqual({
        uid: 'test-uid-456',
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should preserve uid as required field', () => {
      const mockFirebaseUser: FirebaseUser = {
        uid: 'required-uid',
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        metadata: {
          creationTime: '2024-01-01T00:00:00.000Z',
          lastSignInTime: '2024-01-02T00:00:00.000Z',
        },
      } as FirebaseUser;

      const result = mapFirebaseUser(mockFirebaseUser);

      expect(result.uid).toBe('required-uid');
      expect(result.uid).toBeTruthy();
    });
  });
});
