# Expo Mobile App Template

A production-ready React Native mobile app template built with Expo, featuring authentication, navigation, state management, and Firebase integration.

## Features

- ✅ **Authentication**: Full auth flow with Firebase (Login, Signup, Sign Out)
- ✅ **Navigation**: Bottom tab navigation with React Navigation
- ✅ **State Management**: Redux Toolkit for global state
- ✅ **Firebase Integration**: Authentication, Firestore, and Storage ready
- ✅ **TypeScript**: Fully typed for better developer experience
- ✅ **SafeAreaView**: Safe area handling for all screens
- ✅ **Responsive Design**: Clean UI with consistent theming
- ✅ **Easy to Customize**: Well-structured placeholder content

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   ├── config/              # Configuration files
│   │   └── firebase.ts      # Firebase configuration
│   ├── constants/           # Constants and theme
│   │   └── theme.ts         # Color, spacing, font sizes
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── hooks/               # Custom hooks
│   │   └── useRedux.ts      # Typed Redux hooks
│   ├── navigation/          # Navigation structure
│   │   ├── BottomTabNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── auth/            # Auth screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   └── main/            # Main app screens
│   │       ├── HomeScreen.tsx
│   │       ├── ExploreScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── services/            # API and service functions
│   │   └── authService.ts   # Firebase auth services
│   ├── store/               # Redux store
│   │   ├── authSlice.ts     # Auth slice
│   │   └── index.ts         # Store configuration
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Type definitions
│   └── utils/               # Utility functions
├── App.tsx                  # Root component
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio

### Installation

1. **Clone or use this template**
   ```bash
   git clone <your-repo-url>
   cd Expo-Mobile-App-Template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Copy your Firebase configuration
   - Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your Firebase credentials:
   ```env
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - iOS: `npm run ios` (Mac only)
   - Android: `npm run android`
   - Or scan the QR code with Expo Go app

## Customizing the Template

### 1. Update Theme Colors

Edit `src/constants/theme.ts` to customize your app's colors:

```typescript
export const COLORS = {
  primary: '#007AFF',      // Change to your brand color
  secondary: '#5856D6',
  // ... more colors
};
```

### 2. Customize Screens

All screens are located in `src/screens/` with placeholder content. Simply:
- Edit the JSX to match your design
- Update the data/logic as needed
- All screens use SafeAreaView by default

### 3. Add New Screens

1. Create a new screen file: `src/screens/main/NewScreen.tsx`
2. Add the route to `src/types/index.ts`:
   ```typescript
   export type MainTabParamList = {
     Home: undefined;
     NewScreen: undefined; // Add your screen
     // ...
   };
   ```
3. Add to navigator in `src/navigation/BottomTabNavigator.tsx`

### 4. Add Redux Slices

1. Create a new slice: `src/store/yourSlice.ts`
2. Add to store: `src/store/index.ts`
3. Use in components with typed hooks:
   ```typescript
   import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
   ```

### 5. Customize Firebase Services

Edit `src/services/authService.ts` or create new service files for:
- Firestore operations
- Storage uploads
- Cloud Functions calls

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Key Technologies

- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **Redux Toolkit** - State management
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **TypeScript** - Type safety
- **React Native Vector Icons** - Icons
- **AsyncStorage** - Local storage

## Navigation Flow

```
Root Navigator (Stack)
  ├── Welcome Screen
  ├── Login Screen
  ├── SignUp Screen
  └── Main Navigator (Bottom Tabs)
      ├── Home
      ├── Explore
      ├── Profile
      └── Settings
```

## Authentication Flow

1. User opens app → Sees Welcome Screen
2. User signs up or logs in
3. Auth state managed by AuthContext + Redux
4. Authenticated users see Main Tab Navigator
5. Sign out returns to Welcome Screen

## Environment Variables

The template uses `.env` files for configuration. Never commit `.env` to git!

Required variables:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## Tips for Development

1. **Hot Reload**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
2. **Debugging**: Use React Native Debugger or Flipper
3. **Icons**: Browse icons at https://ionic.io/ionicons
4. **Testing**: Test on both iOS and Android regularly
5. **Performance**: Use `React.memo()` and `useMemo()` for optimization

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Or use EAS Build:
```bash
npm install -g eas-cli
eas build --platform all
```

## Common Issues

### Firebase Auth Not Working
- Check that Email/Password authentication is enabled in Firebase Console
- Verify `.env` file has correct Firebase credentials
- Make sure you're not using development credentials in production

### Navigation Not Working
- Ensure all screens are properly registered in navigators
- Check that types in `src/types/index.ts` match your routes

### Icons Not Showing
- Run `npx react-native link react-native-vector-icons`
- Rebuild the app after linking

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this template for your projects.

## Support

For questions or issues:
1. Check the [Expo Documentation](https://docs.expo.dev)
2. Check the [React Navigation Docs](https://reactnavigation.org)
3. Check the [Firebase Docs](https://firebase.google.com/docs)

---

Built with ❤️ using Expo and React Native
