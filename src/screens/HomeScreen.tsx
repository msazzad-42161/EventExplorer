// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedScrollHandler,
  Easing,
} from 'react-native-reanimated';
import { useSearchEventsQuery } from '../store/api/ticketmasterApi';
import { RootStackParamList, Event } from '../types/event.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const STATUSBAR_HEIGHT = StatusBar.currentHeight ?? 20
const HEADER_HEIGHT = 180 + STATUSBAR_HEIGHT; // Approximate height of SearchBar
const HEADER_VISIBILITY_THRESHHOLD = 30
const SCROLL_DELTA_THRESHOLD = 10;


const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Animated values
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);

  // RTK Query hook
  const { data, isLoading, isFetching, error, refetch } = useSearchEventsQuery({
    keyword: searchQuery || undefined,
    city: city || undefined,
    page: currentPage,
    size: 20,
  });

  const events = data?._embedded?.events || [];
  const hasMore = data?.page && currentPage < data.page.totalPages - 1;

  const isFavorite = (eventId: string) => {
    return favorites.some((fav) => fav.id === eventId);
  };

  const handleToggleFavorite = (event: Event) => {
    dispatch(toggleFavorite(event));
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const isHeaderHidden = useSharedValue(false);
  const currentDirection = useSharedValue<'up' | 'down' | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - lastScrollY.value;

      // Ignore small scrolls to avoid jitter
      if (Math.abs(diff) < SCROLL_DELTA_THRESHOLD) return;

      if (currentScrollY > HEADER_VISIBILITY_THRESHHOLD) {
        if (diff > SCROLL_DELTA_THRESHOLD && currentDirection.value !== 'down') {
          // Scroll down → hide header
          headerTranslateY.value = withTiming(
            Math.max(Math.min(-HEADER_HEIGHT, 0), -HEADER_HEIGHT),
            {
              duration: 250,
              easing: Easing.out(Easing.exp),
            }
          );          
          currentDirection.value = 'down';
          isHeaderHidden.value = true;
        } else if (diff < -SCROLL_DELTA_THRESHOLD && currentDirection.value !== 'up') {
          // Scroll up → show header
          headerTranslateY.value = withTiming(
            Math.max(Math.min(0, 0), -HEADER_HEIGHT), // which is just 0
            {
              duration: 250,
              easing: Easing.out(Easing.exp),
            }
          );          
          currentDirection.value = 'up';
          isHeaderHidden.value = false;
        }
      } else if (isHeaderHidden.value) {
        headerTranslateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.exp),
        });
        isHeaderHidden.value = false;
      }

      lastScrollY.value = currentScrollY;
    },
  });



  // Animated header style
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      isFavorite={isFavorite(item.id)}
      onPress={() => handleEventPress(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <EmptyState
        icon="search"
        message={
          searchQuery || city
            ? 'No events found. Try a different search.'
            : 'Search for events by keyword or city to get started!'
        }
      />
    );
  };

  const renderFooter = () => {
    if (!isFetching || isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner message="" size="small" />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Animated Sticky Header */}
      <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
        <SearchBar
          searchQuery={searchQuery}
          city={city}
          onSearchQueryChange={setSearchQuery}
          onCityChange={setCity}
          onSearch={handleSearch}
        />
      </Animated.View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load events. Pull to refresh.
          </Text>
        </View>
      )}

      {/* Events List */}
      <Animated.FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: HEADER_HEIGHT + 16 }, // Add padding for fixed header
        ]}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setCurrentPage(0);
              refetch();
            }}
            tintColor="#007AFF"
            progressViewOffset={HEADER_HEIGHT} // Offset for fixed header
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingTop: STATUSBAR_HEIGHT
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    marginHorizontal: 16,
    marginTop: HEADER_HEIGHT + 8,
    borderRadius: 8,
    zIndex: 999,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default HomeScreen;