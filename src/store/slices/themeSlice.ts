// src/store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';
import { Colors, getColors } from '../../constants/colors';

const THEME_KEY = 'theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: Colors;
}

// Load theme from MMKV on app start
const loadTheme = (): ThemeMode => {
  try {
    const stored = storage.getString(THEME_KEY);
    return (stored as ThemeMode) || 'light';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'light';
  }
};

const initialMode = loadTheme();

const initialState: ThemeState = {
  mode: initialMode,
  colors: getColors(initialMode === 'dark'),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.colors = getColors(state.mode === 'dark'); // 🔥 update colors

      try {
        storage.set(THEME_KEY, state.mode);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.colors = getColors(state.mode === 'dark'); // 🔥 update colors

      try {
        storage.set(THEME_KEY, state.mode);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
