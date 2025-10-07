# Quick Start Guide

Get your app running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Firebase (Required for Auth)

### Option A: Use Demo Mode (Quick Testing)
Skip Firebase setup temporarily - the app will use placeholder keys. **Note: Authentication won't work until you configure real Firebase credentials.**

### Option B: Configure Real Firebase (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Sign-in method → Email/Password
4. Get your config from Project Settings → General → Your apps
5. Create `.env` file:

```bash
cp .env.example .env
```

6. Add your Firebase credentials to `.env`:

```env
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=yourapp.firebaseapp.com
FIREBASE_PROJECT_ID=yourapp
FIREBASE_STORAGE_BUCKET=yourapp.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3. Start the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 4. Test Authentication

1. Run the app
2. Click "Sign Up" on the welcome screen
3. Create an account (email + password)
4. You'll be automatically logged in!

## 5. Start Customizing

### Change App Name
Update `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Primary Color
Edit `src/constants/theme.ts`:
```typescript
primary: '#YOUR_COLOR'
```

### Edit Home Screen
Open `src/screens/main/HomeScreen.tsx` and replace the placeholder content.

## Project Structure

```
src/
├── screens/
│   ├── auth/          # Login, SignUp, Welcome
│   └── main/          # Home, Explore, Profile, Settings
├── navigation/        # Navigation setup
├── store/             # Redux state management
├── services/          # Firebase services
└── config/            # Configuration files
```

## Common Commands

```bash
npm start          # Start dev server
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run in browser
```

## Next Steps

1. ✅ Customize the theme colors
2. ✅ Edit screen content to match your app
3. ✅ Add your own screens
4. ✅ Configure Firebase Firestore for data
5. ✅ Add your app icon and splash screen
6. ✅ Test on real devices

## Need Help?

- Check `README.md` for detailed documentation
- Visit [Expo Docs](https://docs.expo.dev)
- Check [React Navigation](https://reactnavigation.org/docs/getting-started)

Happy coding! 🚀
