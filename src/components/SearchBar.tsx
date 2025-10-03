import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store/hooks';

interface SearchBarProps {
  searchQuery: string;
  city: string;
  onSearchQueryChange: (text: string) => void;
  onCityChange: (text: string) => void;
  onSearch: () => void;
}

export interface SearchBarRef {
  show: () => void;
  hide: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({
  searchQuery,
  city,
  onSearchQueryChange,
  onCityChange,
  onSearch,
}, ref) => {
  const insets = useSafeAreaInsets();
  const colors = useAppSelector((state) => state.theme.colors);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const isVisible = useRef(true);

  useImperativeHandle(ref, () => ({
    show: () => {
      if (!isVisible.current) {
        isVisible.current = true;
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    hide: () => {
      if (isVisible.current) {
        isVisible.current = false;
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  }));
  return (
    <Animated.View 
    style={[styles.searchContainer, {
      paddingTop: insets.top,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      opacity: animatedValue,
      transform: [{
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-200, 0],
        })
      }]
    }]} 
    pointerEvents={isVisible.current ? 'auto' : 'none'}>
      <View style={[styles.searchInputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Ex: Chicago Bulls vs. Atlanta Hawks..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchQueryChange('')}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.searchInputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="location" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Ex: nyc, dha..."
          placeholderTextColor={colors.placeholder}
          value={city}
          onChangeText={onCityChange}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        {city.length > 0 && (
          <TouchableOpacity onPress={() => onCityChange('')}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]} onPress={onSearch}>
        <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    zIndex:1000,
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 10,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(SearchBar);