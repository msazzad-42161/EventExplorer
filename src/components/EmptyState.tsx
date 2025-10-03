import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  message,
}) => {
  const colors = useAppSelector((state) => state.theme.colors);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textTertiary} />
      {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;