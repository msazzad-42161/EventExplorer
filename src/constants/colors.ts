// src/constants/colors.ts

export const lightColors = {
    // Background
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    
    // Text
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Primary
    primary: '#007AFF',
    primaryLight: '#5AC8FA',
    
    // Accent
    accent: '#FF3B30',
    accentLight: '#FF6B6B',
    
    // Status
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // UI Elements
    border: '#e0e0e0',
    divider: '#e0e0e0',
    placeholder: '#C7C7CC',
    disabled: '#d1d1d6',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowStrong: 'rgba(0, 0, 0, 0.2)',
    
    // Category badge
    categoryBadge: '#007AFF',
    
    // Input
    inputBackground: '#f8f8f8',
    inputBorder: '#e0e0e0',
  };
  
  export const darkColors = {
    // Background
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    
    // Primary
    primary: '#0A84FF',
    primaryLight: '#64D2FF',
    
    // Accent
    accent: '#FF453A',
    accentLight: '#FF6961',
    
    // Status
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // UI Elements
    border: '#38383A',
    divider: '#38383A',
    placeholder: '#636366',
    disabled: '#48484A',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowStrong: 'rgba(0, 0, 0, 0.5)',
    
    // Category badge
    categoryBadge: '#0A84FF',
    
    // Input
    inputBackground: '#38383A',
    inputBorder: '#48484A',
  };
  
  export type Colors = typeof lightColors;
  
  export const getColors = (isDark: boolean): Colors => {
    return isDark ? darkColors : lightColors;
  };