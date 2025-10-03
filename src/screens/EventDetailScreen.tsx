import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useGetEventByIdQuery } from '../store/api/ticketmasterApi';
import { RootStackParamList } from '../types/event.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import FavouriteHeart from '../components/FavouriteHeart';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import FAB from '../components/FAB';

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;
type EventDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventDetail'>;

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight

const EventDetailScreen = () => {
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const colors = useAppSelector((state) => state.theme.colors);

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // states
  const [expanded, setExpanded] = useState(false);

  const { eventId } = route.params;
  const { data: event, isLoading, error } = useGetEventByIdQuery(eventId);

  const isFavorite = event ? favorites.some((fav) => fav.id === event.id) : false;

  const handleToggleFavorite = () => {
    if (event) {
      dispatch(toggleFavorite(event));
    }
  };

  const handleBuyTickets = () => {
    if (event?.url) {
      Linking.openURL(event.url);
    }
  };

  const handleOpenMaps = () => {
    const venue = event?._embedded?.venues?.[0];
    if (venue?.location) {
      const { latitude, longitude } = venue.location;
      const label = venue.name || 'Event Venue';
      
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${latitude},${longitude}`;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      if (url) {
        Linking.openURL(url);
      }
    }
  };
  const handleExpansion = (expansion:boolean)=>{
    'worklet';
    setExpanded(expansion)
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      
      // Determine scroll direction and update expanded state
      if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
        // Scrolling down and past threshold
        if (!expanded) {
          runOnJS(setExpanded)(true);
        }
      } else if (currentScrollY < lastScrollY.value && currentScrollY < 50) {
        // Scrolling up and below threshold
        if (expanded) {
          runOnJS(setExpanded)(false);
        }
      }
      
      scrollY.value = currentScrollY;
      lastScrollY.value = currentScrollY;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 100],
      ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)']
    );

    return {
      backgroundColor,
    };
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>Failed to load event details</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const venue = event._embedded?.venues?.[0];
  const image = event.images?.[0]?.url;
  const category = event.classifications?.[0]?.segment?.name || 'Event';
  const genre = event.classifications?.[0]?.genre?.name;
  const priceRange = event.priceRanges?.[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getVenueAddress = () => {
    if (!venue) return null;
    const parts = [];
    if (venue.address?.line1) parts.push(venue.address.line1);
    if (venue.city?.name) parts.push(venue.city.name);
    if (venue.state?.name) parts.push(venue.state.name);
    if (venue.country?.name) parts.push(venue.country.name);
    return parts.join(', ');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Event Image */}
        <View style={styles.headerImageContainer}>
          {image && (
            <Image source={{ uri: image }} style={[styles.headerImage, { backgroundColor: colors.border }]} />
          )}
        </View>

        {/* Event Info */}
        <View style={styles.content}>
          {/* Category Badge */}
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryText, { color: colors.categoryBadge }]}>{category}</Text>
            {genre && <Text style={[styles.genreText, { color: colors.textSecondary }]}> • {genre}</Text>}
          </View>

          {/* Event Name */}
          <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date & Time</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatDate(event.dates.start.localDate)}
              </Text>
              {event.dates.start.localTime && (
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatTime(event.dates.start.localTime)}
                </Text>
              )}
            </View>
          </View>

          {/* Venue */}
          {venue && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Venue</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{venue.name}</Text>
                {getVenueAddress() && (
                  <Text style={[styles.infoAddress, { color: colors.textSecondary }]}>{getVenueAddress()}</Text>
                )}
              </View>
            </View>
          )}

          {/* Price Range */}
          {priceRange && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Price Range</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {priceRange.currency} {priceRange.min} - {priceRange.max}
                </Text>
              </View>
            </View>
          )}

          {/* Description */}
          {(event.info || event.pleaseNote) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Event</Text>
              {event.info && <Text style={[styles.description, { color: colors.textSecondary }]}>{event.info}</Text>}
              {event.pleaseNote && (
                <View style={[styles.noteContainer, { backgroundColor: colors.warning + '20' }]}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.warning} />
                  <Text style={[styles.noteText, { color: colors.warning }]}>{event.pleaseNote}</Text>
                </View>
              )}
            </View>
          )}

          {/* Map */}
          {venue?.location && (
            <View style={styles.section}>
              <View style={styles.mapHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
                <TouchableOpacity onPress={handleOpenMaps}>
                  <Text style={[styles.openMapText, { color: colors.primary }]}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(venue.location.latitude),
                  longitude: parseFloat(venue.location.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(venue.location.latitude),
                    longitude: parseFloat(venue.location.longitude),
                  }}
                  title={venue.name}
                  description={getVenueAddress() || undefined}
                />
              </MapView>
            </View>
          )}
        </View>

      </Animated.ScrollView>
      
      {/* FAB Component */}
      <FAB
        expanded={expanded}
        icon='ticket'
        label='Buy Tickets'
        onPress={handleBuyTickets}
      />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerButton}>
          <FavouriteHeart
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: 12,
    zIndex: 1000,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"rgba(0,0,0,0.6)"
  },
  headerImageContainer: {
    width: width,
    aspectRatio: 1.35,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
    paddingBottom:100
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  genreText: {
    fontSize: 14,
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 34,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  noteContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  openMapText: {
    fontSize: 14,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  buyButton: {
    position:'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    bottom:32,
    left:16,
    right:16
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailScreen;