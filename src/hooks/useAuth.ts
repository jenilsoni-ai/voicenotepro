import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/auth/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthState({
        user,
        loading: false,
      });
    });

    return () => unsubscribe();
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
  };
};