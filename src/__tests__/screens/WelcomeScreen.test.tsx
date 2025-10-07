import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as any;

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    expect(getByText('Welcome to App')).toBeTruthy();
    expect(getByText('Get started by signing in or creating a new account')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
  });

  it('should navigate to SignUp screen when Sign Up button is pressed', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Login screen when Log In button is pressed', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const loginButton = getByText('Log In');
    fireEvent.press(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should have correct button styles', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const signUpButton = getByText('Sign Up').parent;
    const loginButton = getByText('Log In').parent;

    expect(signUpButton).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });
});
