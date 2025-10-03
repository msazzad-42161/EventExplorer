import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSearchEventsQuery } from '../store/api/ticketmasterApi';
import { RootStackParamList, Event } from '../types/event.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import EventCard from '../components/EventCard';
import SearchBar, { SearchBarRef } from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { toggleTheme } from '../store/slices/themeSlice';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCROLL_THRESHOLD = 3;
const SEARCH_BAR_HEIGHT = 180;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const colors = useAppSelector((state) => state.theme.colors);
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);

  // Use useRef instead of useSharedValue for simple tracking
  const lastScrollY = useRef(0);
  const searchBarRef = useRef<SearchBarRef>(null);
  const isHeaderVisible = useRef(true);

  // RTK Query hook
  const { data, isLoading, isFetching, error, refetch } = useSearchEventsQuery({
    keyword: searchQuery || undefined,
    city: city || undefined,
    page: currentPage,
    size: 20,
  });

  const events = data?._embedded?.events || [];
  const hasMore = data?.page && currentPage < data.page.totalPages - 1;

  const isFavorite = useCallback(
    (eventId: string) => favorites.some((fav) => fav.id === eventId),
    [favorites]
  );

  const handleToggleFavorite = useCallback(
    (event: Event) => {
      dispatch(toggleFavorite(event));
    },
    [dispatch]
  );


  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleSearch = useCallback(() => {
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  const handleEventPress = useCallback(
    (eventId: string) => {
      navigation.navigate('EventDetail', { eventId });
    },
    [navigation]
  );

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
      if (scrollDiff > 0 && isHeaderVisible.current) {
        // Scrolling DOWN
        searchBarRef.current?.hide();
        isHeaderVisible.current = false;
      } else if (scrollDiff < 0 && !isHeaderVisible.current) {
        // Scrolling UP
        searchBarRef.current?.show();
        isHeaderVisible.current = true;
      }
    }

    lastScrollY.current = currentScrollY;
  }, []);


  const renderEventCard = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard
        event={item}
        isFavorite={isFavorite(item.id)}
        onPress={() => handleEventPress(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    ),
    [isFavorite, handleEventPress, handleToggleFavorite]
  );

  const renderEmptyState = useCallback(() => {
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
  }, [isLoading, searchQuery, city]);

  const renderFooter = useCallback(() => {
    if (!isFetching || isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner message="" size="small" />
      </View>
    );
  }, [isFetching, isLoading]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:colors.background}]} edges={['bottom', 'left', 'right']}>

      <SearchBar
        ref={searchBarRef}
        searchQuery={searchQuery}
        city={city}
        onSearchQueryChange={setSearchQuery}
        onCityChange={setCity}
        onSearch={handleSearch}
      />

      {error && (
        <View style={[styles.errorContainer, { top: SEARCH_BAR_HEIGHT + insets.top + 16 }]}>
          <Text style={styles.errorText}>
            Failed to load events. Pull to refresh.
          </Text>
        </View>
      )}

      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: SEARCH_BAR_HEIGHT + insets.top + 8 },
        ]}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && currentPage === 0}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
            progressViewOffset={SEARCH_BAR_HEIGHT + insets.top}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
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