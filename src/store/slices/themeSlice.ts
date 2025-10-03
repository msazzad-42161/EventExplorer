// src/store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';
import { Colors, getColors, lightColors } from '../../constants/colors';

const THEME_KEY = 'theme';
const CUSTOM_COLORS_KEY = 'customColors';

export type ThemeMode = 'light' | 'dark' | 'custom';

interface ThemeState {
  mode: ThemeMode;
  colors: Colors;
  customColors: Colors;
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

// Load custom colors from MMKV
const loadCustomColors = (): Colors => {
  try {
    const stored = storage.getString(CUSTOM_COLORS_KEY);
    return stored ? JSON.parse(stored) : { ...lightColors };
  } catch (error) {
    console.error('Error loading custom colors:', error);
    return { ...lightColors };
  }
};

const initialMode = loadTheme();
const initialCustomColors = loadCustomColors();

const initialState: ThemeState = {
  mode: initialMode,
  colors: initialMode === 'custom' ? initialCustomColors : getColors(initialMode === 'dark'),
  customColors: initialCustomColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.colors = getColors(state.mode === 'dark');

      try {
        storage.set(THEME_KEY, state.mode);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      
      if (action.payload === 'custom') {
        state.colors = state.customColors;
      } else {
        state.colors = getColors(action.payload === 'dark');
      }

      try {
        storage.set(THEME_KEY, state.mode);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
    setCustomColor: (state, action: PayloadAction<{ key: keyof Colors; value: string }>) => {
      const { key, value } = action.payload;
      state.customColors[key] = value;
      
      // If currently on custom theme, update active colors immediately
      if (state.mode === 'custom') {
        state.colors[key] = value;
      }

      try {
        storage.set(CUSTOM_COLORS_KEY, JSON.stringify(state.customColors));
      } catch (error) {
        console.error('Error saving custom colors:', error);
      }
    },
    resetCustomColors: (state) => {
      state.customColors = { ...lightColors };
      
      if (state.mode === 'custom') {
        state.colors = { ...lightColors };
      }

      try {
        storage.set(CUSTOM_COLORS_KEY, JSON.stringify(state.customColors));
      } catch (error) {
        console.error('Error saving custom colors:', error);
      }
    },
  },
});

export const { toggleTheme, setTheme, setCustomColor, resetCustomColors } = themeSlice.actions;
export default themeSlice.reducer;