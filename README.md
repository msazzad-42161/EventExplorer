# 🎉 Event Explorer - React Native App (Lyxa Test Project)

A modern, feature-rich mobile application for discovering and exploring live events (music, sports, arts, etc.) using the Ticketmaster Discovery API. Built with React Native, TypeScript, and Redux Toolkit.

## 📸 Screenshots

[Add your screenshots here]

## ✨ Features

### Core Features
- 🔍 **Search Events** - Search by keyword or city
- 📋 **Event Listings** - Scrollable list with event details (name, date, image, venue, category)
- 📱 **Event Details** - Comprehensive info including description, price range, and venue location
- 🗺️ **Map Integration** - Interactive map showing venue location with Google Maps/Apple Maps integration
- ❤️ **Favorites System** - Save favorite events with persistent storage
- 🎫 **Buy Tickets** - Direct link to purchase tickets on Ticketmaster

### Additional Features
- 🌙 **Dark Mode** - Beautiful dark theme with smooth transitions
- ♾️ **Infinite Scroll** - Automatic pagination when scrolling
- 🔄 **Pull to Refresh** - Update event listings
- 📲 **Animated Sticky Header** - Hide/show search bar on scroll
- 💾 **Persistent Storage** - Favorites and theme saved with MMKV
- ⚡ **Optimized Performance** - React Native New Architecture support
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Framework**: React Native (Expo) v0.76+ with New Architecture
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Local Storage**: MMKV (react-native-mmkv)
- **Maps**: react-native-maps
- **Animations**: React Native Reanimated 4
- **Icons**: @expo/vector-icons (Ionicons)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Physical device with Expo Go app (optional)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/msazzad-42161/EventExplorer.git
cd EventExplorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up API Keys

#### Ticketmaster API Key
1. Visit [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Sign up and create an app to get your API key
3. Open `src/store/api/ticketmasterApi.ts`
4. Replace with your actual API key:

```typescript
const TICKETMASTER_API_KEY = 'your_actual_api_key_here';
```

#### Google Maps API Key (Android only)
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Maps SDK for Android
3. Get your API key
4. Add to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

> **Note**: iOS maps work without additional configuration.


### 4. Run the App

```bash
# Start the development server
npx expo start

# Run on iOS simulator or device
npx expo run:ios --device

# Run on Android emulator
npx expo run:android --device

# Clear cache if needed
npx expo start -c
```

## 📁 Project Structure

```
App.tsx
src/
├── components/          # Reusable UI components
|   ├── EmptyState.tsx
│   ├── EventCard.tsx
│   ├── SearchBar.tsx
│   ├── FAB.tsx
│   ├── LoadingSpinner.tsx
│   └── FavouriteHeart.tsx
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── FavoritesScreen.tsx
    ├── PreferencesScreen.tsx
│   └── EventDetailScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── store/             # Redux store
│   ├── store.ts
│   ├── hooks.ts
│   ├── api/
│   │   └── ticketmasterApi.ts
│   └── slices/
│       ├── favoritesSlice.ts
│       └── themeSlice.ts
├── types/             # TypeScript type definitions
│   └── event.types.ts
├── constants/         # App constants
│   └── colors.ts
└── utils/            # Utility functions
    └── storage.ts
```

## 🎨 Key Architecture Decisions

### State Management
- **Redux Toolkit** for global state management
- **RTK Query** for API calls with automatic caching
- **MMKV** for fast, persistent local storage

### Why Redux over Context?
- Better DevTools support
- More scalable for complex state
- RTK Query integration
- Consistent pattern across the app

### Navigation
- **Stack Navigator** for main navigation flow
- **Bottom Tab Navigator** for primary app sections
- Type-safe navigation with TypeScript

### Animations
- **Reanimated 4** for smooth animations
- Animated sticky header with spring physics
- Smooth theme transitions

## 🔑 Key Features Implementation

### Favorites System
```typescript
// Toggle favorite
dispatch(toggleFavorite(event));

// Check if favorited
const isFavorite = favorites.some(fav => fav.id === eventId);
```

### Theme System
```typescript
const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.mode);
  const colors = useAppSelector((state) => state.theme.colors);
  const customColors = useAppSelector((state) => state.theme.customColors);

  const handleThemeSelect = useCallback((theme: 'light' | 'dark' | 'custom') => {
    dispatch(setTheme(theme));
  }, [dispatch]);

  const handleColorChange = useCallback((key: keyof Colors, value: string) => {
    dispatch(setCustomColor({ key, value }));
  }, [dispatch]);

  const handleResetColors = useCallback(() => {
    dispatch(resetCustomColors());
  }, [dispatch]);

```

### Infinite Scroll Pagination
```typescript
const { data, isLoading } = useSearchEventsQuery({
  keyword: searchQuery,
  city: city,
  page: currentPage,
  size: 20,
});
```

## 🧪 Testing

Run tests (if implemented):
```bash
npm test
# or
yarn test
```

## 📝 Environment Variables

While the app uses hardcoded API keys for simplicity, in production you should use environment variables:

```bash
# .env
BASE_URL=""
TICKETMASTER_API_KEY=""
GOOGLE_MAPS_API_KEY=""
```

## 🚧 Known Issues & Limitations

- **Pagination Reset**: Searching resets to page 0
- **Map Interaction**: Map in detail screen has limited interaction (by design)
- **Offline Mode**: No offline support
- **Image Loading**: No shimmer loading for images yet

## 🎯 Future Enhancements

- [ ] Unit tests with Jest and React Testing Library
- [ ] E2E tests with Detox
- [ ] Offline support with local caching
- [ ] Event reminders/notifications
- [ ] Share events functionality
- [ ] Filter by date range and price
- [ ] Nearby events (geolocation)
- [ ] Event recommendations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Ticketmaster Discovery API](https://developer.ticketmaster.com/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)

## 📧 Contact

Md. Sazzadul Islam - [@msazzadi](https://x.com/msazzadi)

Project Link: [https://github.com/msazzad-42161/EventExplorer](https://github.com/msazzad-42161/EventExplorer)

---

Made with ❤️ using React Native, TypeScript & Reanimated