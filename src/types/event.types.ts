// src/types/event.types.ts

export interface EventImage {
  url: string;
  ratio?: string;
  width?: number;
  height?: number;
}

export interface EventDate {
  start: {
    localDate: string;
    localTime?: string;
    dateTime?: string;
  };
}

export interface EventClassification {
  segment?: {
    name: string;
  };
  genre?: {
    name: string;
  };
}

export interface EventVenue {
  name: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
  };
  country?: {
    name: string;
  };
  address?: {
    line1: string;
  };
  location?: {
    latitude: string;
    longitude: string;
  };
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Event {
  id: string;
  name: string;
  url: string;
  images: EventImage[];
  dates: EventDate;
  classifications?: EventClassification[];
  _embedded?: {
    venues?: EventVenue[];
  };
  info?: string;
  pleaseNote?: string;
  priceRanges?: PriceRange[];
}

export interface EventsResponse {
  _embedded?: {
    events: Event[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  page?: number;
  size?: number;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: { eventId: string };
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
};