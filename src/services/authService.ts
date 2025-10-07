import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';

// Convert Firebase user to our User type
export const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
  createdAt: firebaseUser.metadata.creationTime,
  updatedAt: firebaseUser.metadata.lastSignInTime,
});

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    return mapFirebaseUser(userCredential.user);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

// Update user profile
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};
