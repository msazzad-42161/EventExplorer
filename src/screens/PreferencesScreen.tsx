import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme, setCustomColor, resetCustomColors } from '../store/slices/themeSlice';
import { Colors } from '../constants/colors';

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
      
      <View style={styles.bentoContainer}>
        {/* Light Theme Box */}
        <TouchableOpacity
          style={[
            styles.bentoBox,
            styles.halfBox,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
            currentTheme === 'light' && [styles.selectedBox, { borderColor: colors.primary }]
          ]}
          onPress={() => handleThemeSelect('light')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
            <Ionicons name="sunny" size={32} color={colors.text} />
          </View>
          <Text style={[styles.boxTitle, { color: colors.text }]}>Light</Text>
          {currentTheme === 'light' && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Dark Theme Box */}
        <TouchableOpacity
          style={[
            styles.bentoBox,
            styles.halfBox,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
            currentTheme === 'dark' && [styles.selectedBox, { borderColor: colors.primary }]
          ]}
          onPress={() => handleThemeSelect('dark')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
            <Ionicons name="moon" size={32} color={colors.text} />
          </View>
          <Text style={[styles.boxTitle, { color: colors.text }]}>Dark</Text>
          {currentTheme === 'dark' && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Custom Color Theme Box with Scrollable Content */}
        <View
          style={[
            styles.bentoBox,
            styles.fullBox,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
            currentTheme === 'custom' && [styles.selectedBox, { borderColor: colors.primary }]
          ]}
        >
          <TouchableOpacity
            style={styles.customThemeHeader}
            onPress={() => handleThemeSelect('custom')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name='color-palette' size={32} color="#ffffff"/>
            </View>
            <View style={styles.customThemeHeaderText}>
              <Text style={[styles.boxTitle, { color: colors.text }]}>Custom Theme</Text>
              <Text style={[styles.boxSubtitle, { color: colors.textSecondary }]}>
                Customize every color variable
              </Text>
            </View>
            {currentTheme === 'custom' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Scrollable Color Editor */}
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

          <ScrollView 
            style={styles.colorEditorScroll}
            showsVerticalScrollIndicator={false}
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
    </View>
  );
});

export default PreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  bentoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  bentoBox: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  halfBox: {
    width: '47%',
    height: 180,
  },
  fullBox: {
    flex: 1,
    width: '100%',
    minHeight: 400,
  },
  selectedBox: {
    borderWidth: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  boxSubtitle: {
    fontSize: 14,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customThemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  customThemeHeaderText: {
    marginLeft: 16,
    flex: 1,
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