import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'event-explorer-storage',
  encryptionKey: 'some-encryption-key-here', // Optional: for encrypted storage
});

// Helper functions for type-safe storage operations
export const StorageHelper = {
  setItem: (key: string, value: any) => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : defaultValue || null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue || null;
    }
  },

  removeItem: (key: string) => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  clear: () => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};