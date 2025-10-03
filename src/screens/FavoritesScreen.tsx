import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Event } from '../types/event.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite, clearFavorites } from '../store/slices/favoritesSlice';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeOut, FadeOutUp, LinearTransition } from 'react-native-reanimated';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const _damping = 25
const _stiffness = 120
const _entering = FadeInDown.springify().damping(_damping).stiffness(_stiffness).duration(350)
const _exiting = FadeOut.duration(200)
const _layout = LinearTransition.springify().damping(_damping).stiffness(_stiffness).duration(300)
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const handleToggleFavorite = (event: Event) => {
    dispatch(toggleFavorite(event));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorite events?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearFavorites()),
        },
      ]
    );
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <Animated.View
    entering={_entering}
    exiting={_exiting}
    layout={_layout}
    >
      <EventCard
        event={item}
        isFavorite={true}
        onPress={() => handleEventPress(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    </Animated.View>
  );

  const renderHeader = () => {
    if (favorites.length === 0) return null;

    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {favorites.length} {favorites.length === 1 ? 'Event' : 'Events'} Saved
        </Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="heart-outline"
      title="No Favorites Yet"
      message="Events you favorite will appear here. Start exploring and save your favorite events!"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={favorites}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyListContent,
        ]}
        // ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
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
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  clearButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
});

export default FavoritesScreen;