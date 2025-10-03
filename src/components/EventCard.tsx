import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types/event.types';
import FavouriteHeart from './FavouriteHeart';

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  const getEventImage = () => {
    return event.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEventCategory = () => {
    return event.classifications?.[0]?.segment?.name || 'Event';
  };

  const getVenueName = () => {
    return event._embedded?.venues?.[0]?.name || 'Venue TBA';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: getEventImage() }} style={styles.image} resizeMode="cover" />

        <Pressable style={styles.favoriteButton}>
          <FavouriteHeart handleToggleFavorite={onToggleFavorite} isFavorite={isFavorite} />
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.category}>{getEventCategory()}</Text>
        <Text style={styles.title} numberOfLines={2}>{event.name}</Text>
        <Text style={styles.date}>{formatDate(event.dates.start.localDate)}</Text>
        
        <View style={styles.venueRow}>
          <Ionicons name="location-sharp" size={16} color="#999" style={styles.icon} />
          <Text style={styles.venue} numberOfLines={1}>{getVenueName()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  venue: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
});

export default EventCard;
