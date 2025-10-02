// src/store/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types/event.types';
import { storage } from '../../utils/storage';

const FAVORITES_KEY = 'favorites';

interface FavoritesState {
  items: Event[];
}

// Load favorites from MMKV on app start
const loadFavorites = (): Event[] => {
  try {
    const stored = storage.getString(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

const initialState: FavoritesState = {
  items: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Event>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex !== -1) {
        // Remove from favorites
        state.items.splice(existingIndex, 1);
      } else {
        // Add to favorites
        state.items.push(action.payload);
      }

      // Persist to MMKV
      try {
        storage.set(FAVORITES_KEY, JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      try {
        storage.delete(FAVORITES_KEY);
      } catch (error) {
        console.error('Error clearing favorites:', error);
      }
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;