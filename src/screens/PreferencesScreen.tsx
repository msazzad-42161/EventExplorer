import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme, setCustomColor, resetCustomColors } from '../store/slices/themeSlice';
import { Colors } from '../constants/colors';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

// Color variable labels for better UX
const colorLabels: Record<keyof Colors, string> = {
  background: 'Background',
  surface: 'Surface',
  card: 'Card',
  text: 'Text',
  textSecondary: 'Text Secondary',
  textTertiary: 'Text Tertiary',
  primary: 'Primary',
  primaryLight: 'Primary Light',
  accent: 'Accent',
  accentLight: 'Accent Light',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
  border: 'Border',
  divider: 'Divider',
  placeholder: 'Placeholder',
  disabled: 'Disabled',
  shadow: 'Shadow',
  shadowStrong: 'Shadow Strong',
  categoryBadge: 'Category Badge',
  inputBackground: 'Input Background',
  inputBorder: 'Input Border',
};

const PreferencesScreen = memo(() => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.mode);
  const colors = useAppSelector((state) => state.theme.colors);
  const customColors = useAppSelector((state) => state.theme.customColors);

  const handleThemeSelect = useCallback((theme: 'light' | 'dark' | 'custom') => {
    dispatch(setTheme(theme));
  }, [dispatch]);

  const handleColorChange = useCallback((key: keyof Colors, value: string) => {
    dispatch(setCustomColor({ key, value }));
  }, [dispatch]);

  const handleResetColors = useCallback(() => {
    dispatch(resetCustomColors());
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Preferences</Text>
      
      {/* Theme Selection Row */}
      <View style={styles.themeRow}>
        {/* Light Theme */}
        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: colors.surface },
            currentTheme === 'light' && [styles.selectedTheme, { borderColor: colors.primary }]
          ]}
          onPress={() => handleThemeSelect('light')}
        >
          <Ionicons name="sunny" size={32} color={colors.text} />
          <Text style={[styles.themeText, { color: colors.text }]}>Light</Text>
           <View style={[styles.checkmark, { backgroundColor: currentTheme === 'light' ? colors.primary : colors.disabled }]}>
             {currentTheme === 'light' && <Text style={styles.checkmarkText}>✓</Text>}
           </View>
        </TouchableOpacity>

        {/* Dark Theme */}
        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: colors.surface },
            currentTheme === 'dark' && [styles.selectedTheme, { borderColor: colors.primary }]
          ]}
          onPress={() => handleThemeSelect('dark')}
        >
          <Ionicons name="moon" size={32} color={colors.text} />
          <Text style={[styles.themeText, { color: colors.text }]}>Dark</Text>
           <View style={[styles.checkmark, { backgroundColor: currentTheme === 'dark' ? colors.primary : colors.disabled }]}>
             {currentTheme === 'dark' && <Text style={styles.checkmarkText}>✓</Text>}
           </View>
        </TouchableOpacity>
      </View>

      {/* Custom Theme Section - Takes remaining space */}
      <View style={[styles.customThemeContainer, { backgroundColor: colors.surface, borderRadius: 16 }]}>
        {/* Custom Theme Header */}
        <TouchableOpacity
          style={styles.customThemeHeader}
          onPress={() => handleThemeSelect('custom')}
          activeOpacity={0.7}
        >
          <View style={[styles.customThemeIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name='color-palette' size={32} color="#ffffff"/>
          </View>
          <View style={styles.customThemeText}>
            <Text style={[styles.customThemeTitle, { color: colors.text }]}>Custom Theme</Text>
            <Text style={[styles.customThemeSubtitle, { color: colors.textSecondary }]}>
              Customize every color variable
            </Text>
          </View>
           <View style={[styles.checkmark, { backgroundColor: currentTheme === 'custom' ? colors.primary : colors.disabled }]}>
             {currentTheme === 'custom' && <Text style={styles.checkmarkText}>✓</Text>}
           </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Color Editor Header */}
        <View style={styles.colorEditorHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Color Variables
          </Text>
          <TouchableOpacity 
            onPress={handleResetColors}
            style={[styles.resetButton, { backgroundColor: colors.inputBackground }]}
          >
            <Text style={[styles.resetButtonText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Color Editor */}
        <ScrollView 
          style={styles.colorEditorScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {(Object.keys(colorLabels) as Array<keyof Colors>).map((key) => (
            <View key={key} style={[styles.colorRow, { borderBottomColor: colors.border }]}>
              <View style={styles.colorInfo}>
                <Text style={[styles.colorLabel, { color: colors.text }]}>
                  {colorLabels[key]}
                </Text>
                <Text style={[styles.colorKey, { color: colors.textSecondary }]}>
                  {key}
                </Text>
              </View>
              
              <View style={styles.colorInputContainer}>
                <View 
                  style={[
                    styles.colorPreviewBox, 
                    { backgroundColor: customColors[key], borderColor: colors.border }
                  ]} 
                />
                <TextInput
                  style={[
                    styles.colorInput,
                    { 
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.inputBorder
                    }
                  ]}
                  value={customColors[key]}
                  onChangeText={(value) => handleColorChange(key, value)}
                  placeholder="#000000"
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
});

export default PreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: (typeof STATUSBAR_HEIGHT === 'number' ? STATUSBAR_HEIGHT : 0) + 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  themeButton: {
    flex: 1,
    aspectRatio: 1,
    padding: 16,
    gap: 16,
    borderRadius: 16,
    position: 'relative',
  },
  selectedTheme: {
    borderWidth: 3,
  },
  themeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily:'monospace'
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customThemeContainer: {
    flex: 1,
    padding: 20,
    borderRadius:16
  },
  customThemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  customThemeIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customThemeText: {
    marginLeft: 16,
    flex: 1,
  },
  customThemeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  customThemeSubtitle: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  colorEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  colorEditorScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  colorInfo: {
    flex: 1,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  colorKey: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorPreviewBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
  },
  colorInput: {
    width: 90,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});