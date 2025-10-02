// src/components/EventCard.tsx
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
    <TouchableOpacity
      style={styles.eventCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: getEventImage() }} style={styles.eventImage} />
      
      <Pressable
        style={styles.favoriteButton}
      >
        <FavouriteHeart handleToggleFavorite={onToggleFavorite} isFavorite={isFavorite}/>
      </Pressable>

      <View style={styles.eventInfo}>
        <Text style={styles.eventCategory}>{getEventCategory()}</Text>
        <Text style={styles.eventName} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={styles.eventDate}>
          {formatDate(event.dates.start.localDate)}
        </Text>
        <View style={styles.venueRow}>
          <Ionicons name="location-sharp" size={16} color="#666" style={styles.venueIcon} />
          <Text style={styles.eventVenue} numberOfLines={1}>
            {getVenueName()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
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
  },
  eventInfo: {
    padding: 16,
  },
  eventCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    marginRight: 6,
  },
});

export default EventCard;