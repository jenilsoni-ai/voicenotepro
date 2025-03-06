import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
  Auth
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { appConfig } from '../../config/app';

// Initialize Firebase
const app = initializeApp(appConfig.firebase);
const auth: Auth = getAuth(app);

export interface AuthError {
  code: string;
  message: string;
}

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw {
        code: error.code,
        message: error.message
      };
    }
    throw {
      code: 'unknown',
      message: 'An unexpected error occurred'
    };
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw {
        code: error.code,
        message: error.message
      };
    }
    throw {
      code: 'unknown',
      message: 'An unexpected error occurred'
    };
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw {
        code: error.code,
        message: error.message
      };
    }
    throw {
      code: 'unknown',
      message: 'An unexpected error occurred'
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw {
        code: error.code,
        message: error.message
      };
    }
    throw {
      code: 'unknown',
      message: 'An unexpected error occurred'
    };
  }
};

export { auth };