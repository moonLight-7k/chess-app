export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Game: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Settings: undefined;
};
