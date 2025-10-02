// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSearchEventsQuery } from '../store/api/ticketmasterApi';
import { RootStackParamList, Event } from '../types/event.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

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
    <SafeAreaView style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        city={city}
        onSearchQueryChange={setSearchQuery}
        onCityChange={setCity}
        onSearch={handleSearch}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load events. Pull to refresh.
          </Text>
        </View>
      )}

      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setCurrentPage(0);
              refetch();
            }}
            tintColor="#007AFF"
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
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    margin: 16,
    borderRadius: 8,
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