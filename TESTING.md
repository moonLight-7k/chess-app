# Testing Guide

## Test Setup

Testing infrastructure has been set up with Jest and React Native Testing Library.

### Installed Dependencies
- `jest` - Testing framework
- `@testing-library/react-native` - React Native testing utilities
- `jest-expo` - Expo Jest preset
- `@types/jest` - TypeScript types for Jest

### Test Files Created

```
src/__tests__/
├── services/
│   └── authService.test.ts     # Auth service tests
├── store/
│   └── authSlice.test.ts       # Redux slice tests
├── screens/
│   ├── WelcomeScreen.test.tsx   # Welcome screen tests
│   ├── HomeScreen.test.tsx      # Home screen tests
│   └── ProfileScreen.test.tsx   # Profile screen tests
└── utils/
    └── validation.test.ts       # Utility function tests
```

### Current Status

⚠️ **Testing requires additional configuration** due to Expo SDK 54 and React Native 0.81 compatibility issues.

The template includes comprehensive test examples, but they need environment-specific adjustments to run successfully.

### Known Issues

1. **Expo Winter Runtime**: New Expo module system requires specific Jest configuration
2. **Transform Patterns**: Some node_modules packages need to be transformed
3. **Mock Configuration**: Firebase and React Native mocks need refinement

### Test Examples Included

#### 1. Redux Store Tests (`authSlice.test.ts`)
- Tests all Redux actions (setUser, setLoading, setError, clearAuth)
- Tests state transitions
- Tests complex scenarios

#### 2. Service Tests (`authService.test.ts`)
- Tests Firebase user mapping
- Tests data transformation
- Tests null value handling

#### 3. Screen Tests
- Tests component rendering
- Tests user interactions
- Tests navigation
- Tests data display

### Running Tests

```bash
npm test
```

### Configuration Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup and mocks
- `__mocks__/` - Mock files for dependencies

### Fixing Test Issues

To get tests running, you may need to:

1. **Update transformIgnorePatterns** in `jest.config.js`
2. **Configure Expo mocks** properly
3. **Update Firebase mocks** based on your setup
4. **Add missing mocks** for any new dependencies

### Recommended Approach

For production use:

1. **Start with unit tests** for utilities and services
2. **Add integration tests** for Redux store
3. **Add component tests** gradually
4. **Mock external dependencies** completely

### Alternative: E2E Testing

Consider using Detox or Maestro for end-to-end testing as an alternative:

```bash
# Detox
npm install --save-dev detox

# Maestro
curl -Ls https://get.maestro.mobile.dev | bash
```

### Writing New Tests

Example test structure:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const mockFn = jest.fn();
    const { getByText } = render(<YourComponent onPress={mockFn} />);

    fireEvent.press(getByText('Button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing](https://docs.expo.dev/develop/unit-testing/)
- [Testing React Native Apps](https://reactnative.dev/docs/testing-overview)

## Summary

The testing infrastructure is in place with comprehensive test examples. However, due to Expo SDK version complexities, additional configuration is needed to run tests successfully. The test files serve as excellent templates for writing your own tests once the environment is properly configured.

For immediate development, consider:
1. Manual testing on devices/simulators
2. Using Expo Go for quick iteration
3. Setting up E2E tests with Detox/Maestro
4. Gradually adding unit tests as you stabilize the Jest configuration
