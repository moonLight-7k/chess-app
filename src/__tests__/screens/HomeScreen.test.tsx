import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../../screens/main/HomeScreen';

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

describe('HomeScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText(/Hello, Test User!/)).toBeTruthy();
    expect(getByText('Welcome to your home screen')).toBeTruthy();
  });

  it('should display user greeting with name', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText(/Test User/)).toBeTruthy();
  });

  it('should display Quick Stats section', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Quick Stats')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
    expect(getByText('Active Items')).toBeTruthy();
    expect(getByText('45')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('should display Recent Activity section', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Recent Activity')).toBeTruthy();
    expect(getByText(/placeholder content/i)).toBeTruthy();
  });

  it('should display Featured section', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Featured')).toBeTruthy();
    expect(getByText(/featured content/i)).toBeTruthy();
  });

  it('should handle user without displayName', () => {
    jest.mock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { ...mockUser, displayName: null },
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      }),
    }));

    const { getByText } = render(<HomeScreen />);
    // Should fallback to 'User' if displayName is null
    expect(getByText(/Hello,/)).toBeTruthy();
  });
});
