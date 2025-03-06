import { doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const USERS_COLLECTION = 'users';

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  notifications: true,
  language: 'en'
};

export class SettingsService {
  /**
   * Subscribe to user settings changes
   */
  subscribeToUserSettings(userId: string, callback: (settings: UserSettings) => void) {
    const userRef = doc(db, USERS_COLLECTION, userId);

    return onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.data();
      if (userData && userData.settings) {
        callback(userData.settings as UserSettings);
      } else {
        // Initialize with default settings if document doesn't exist
        this.updateUserSettings(userId, defaultSettings);
        callback(defaultSettings);
      }
    });
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId: string, settings: Partial<UserSettings>) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document with default settings
        await setDoc(userRef, {
          settings: { ...defaultSettings, ...settings },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Update existing settings
        const currentSettings = userDoc.data().settings || defaultSettings;
        await updateDoc(userRef, {
          settings: { ...currentSettings, ...settings },
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  /**
   * Get current user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().settings) {
        return userDoc.data().settings as UserSettings;
      }

      return defaultSettings;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();