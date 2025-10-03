import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Event, EventsResponse, SearchParams } from '../../types/event.types';

// Replace with your actual API key
const TICKETMASTER_API_KEY = "ydx3KEKbSYu3MdGt9O0dcxeranDdCAlv";
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/";

export const ticketmasterApi = createApi({
  reducerPath: 'ticketmasterApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    searchEvents: builder.query<EventsResponse, SearchParams>({
      query: ({ keyword, city, page = 0, size = 20 }) => {
        const params = new URLSearchParams({
          apikey: TICKETMASTER_API_KEY,
          size: size.toString(),
          page: page.toString(),
        });

        if (keyword) {
          params.append('keyword', keyword);
        }
        if (city) {
          params.append('city', city);
        }

        return `/events.json?${params.toString()}`;
      },
      // Transform empty responses
      transformResponse: (response: EventsResponse) => {
        if (!response._embedded?.events) {
          return {
            ...response,
            _embedded: { events: [] },
            page: response.page || { size: 0, totalElements: 0, totalPages: 0, number: 0 },
          };
        }
        return response;
      },
    }),
    getEventById: builder.query<Event, string>({
      query: (id) => `/events/${id}.json?apikey=${TICKETMASTER_API_KEY}`,
    }),
  }),
});

export const { useSearchEventsQuery, useGetEventByIdQuery } = ticketmasterApi;