import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../screens/main/ProfileScreen';

// Mock AuthContext
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('should display profile stats', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('24')).toBeTruthy();
    expect(getByText('Posts')).toBeTruthy();
    expect(getByText('156')).toBeTruthy();
    expect(getByText('Followers')).toBeTruthy();
    expect(getByText('89')).toBeTruthy();
    expect(getByText('Following')).toBeTruthy();
  });

  it('should display profile settings section', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Profile Settings')).toBeTruthy();
    expect(getByText('Edit Profile')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Privacy')).toBeTruthy();
    expect(getByText('Help & Support')).toBeTruthy();
  });

  it('should display About section', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('About')).toBeTruthy();
    expect(getByText(/profile page/i)).toBeTruthy();
  });

  it('should display user avatar with first letter of name', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('T')).toBeTruthy(); // First letter of "Test User"
  });
});
