# Analog Clock - World Clock Application

A beautiful, feature-rich **React Native** mobile application that displays an **analog clock** showing the current time across different timezones around the world. This cross-platform app runs on both iOS and Android with smooth animations and offline support.

![React Native](https://img.shields.io/badge/React%20Native-0.83.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📱 Features

### Core Functionality
- **Analog Clock Display**: Beautiful analog clock with hour, minute, and second hands
- **Digital Time Display**: Complementary digital time display with AM/PM indicator
- **Timezone Selection**: Choose from hundreds of timezones worldwide
- **Real-time Updates**: Clock updates every second with smooth animations
- **Offline Support**: SQLite database caching for offline functionality

### Technical Highlights
- **Smooth Animations**: Powered by `react-native-reanimated` for 60fps animations
- **Offline Persistence**: Local SQLite database stores timezone data
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Modern UI**: Glassmorphism design with gradients and shadows
- **API Integration**: Fetches timezone data from TimezoneDB API
- **Error Handling**: Robust error handling and loading states

## 🏗️ Architecture

### Project Structure

```
AnalogClock/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnalogClock/     # Main clock component
│   │   └── TimezoneSelector/ # Timezone picker component
│   ├── config/              # Configuration files
│   │   ├── EndPoint.ts      # API endpoints
│   │   ├── http.ts          # HTTP client setup
│   │   └── urls.tsx         # API URLs
│   ├── database/            # SQLite database layer
│   │   ├── database.ts      # Database operations
│   │   └── types.ts         # Database types and schemas
│   ├── hooks/               # Custom React hooks
│   │   ├── useSelectedTimezone.ts  # Timezone selection hook
│   │   └── useTimezones.ts  # Timezone data fetching hook
│   ├── services/            # API services
│   │   └── timezoneService.ts  # Timezone API integration
│   └── utils/               # Utility functions
│       └── clockUtils.ts    # Clock calculation utilities
├── android/                 # Android native code
├── ios/                     # iOS native code
├── patches/                 # Package patches
├── App.tsx                  # Main application component
└── index.js                 # Application entry point
```

### Technology Stack

#### Core Technologies
- **React Native 0.83.1**: Cross-platform mobile framework
- **React 19.2.0**: UI library with latest features
- **TypeScript 5.8.3**: Type-safe development

#### UI & Animation
- **react-native-reanimated 4.2.1**: 60fps animations for clock hands
- **react-native-worklets 0.7.2**: JS worklets for animation
- **react-native-safe-area-context 5.5.2**: Safe area handling

#### Data & Storage
- **react-native-sqlite-storage 6.0.1**: Local database for offline support
- **axios 1.13.4**: HTTP client for API requests

#### Developer Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Jest**: Unit testing framework
- **patch-package**: For managing npm package patches

## 🎨 Component Details

### AnalogClock Component
The main clock component that renders:
- **Clock Face**: Circular clock with 60 tick marks (hour and minute indicators)
- **Numbers**: 12-hour format numbers positioned around the clock
- **Hour Hand**: Rotates based on hours (includes minute precision)
- **Minute Hand**: Rotates based on minutes (includes second precision)
- **Second Hand**: Smooth continuous rotation
- **Center Dot**: Red center dot as visual anchor
- **Digital Display**: Shows time in HH:MM:SS AM/PM format

**Key Features:**
- Uses `useAnimatedStyle` from Reanimated for smooth 60fps animations
- Calculates hand rotations: 
  - Hour: 30° per hour + 0.5° per minute
  - Minute: 6° per minute + 0.1° per second
  - Second: 6° per second
- Responsive sizing based on device width (90% of screen width)
- Updates every second via `setInterval`

### TimezoneSelector Component
A picker component allowing users to select from available timezones:
- Displays timezone names and GMT offsets
- Integrates with `@react-native-picker/picker`
- Saves selection to local storage for persistence

### Database Layer
SQLite operations for offline functionality:
- **Tables:**
  - `timezones`: Stores timezone data (countryName, zoneName, gmtOffset, timestamp)
  - `preferences`: Stores user preferences and last selected timezone
- **Operations:**
  - Save/retrieve timezones in batches (50 at a time)
  - Store last selected timezone
  - Query timezones sorted by country name

### Custom Hooks

#### `useTimezones`
- Fetches timezone data from TimezoneDB API
- Falls back to cached database data if offline
- Handles loading and error states
- Returns timezone list for the selector

#### `useSelectedTimezone`
- Manages currently selected timezone
- Persists selection to database
- Loads last selected timezone on app start
- Defaults to device timezone if no selection exists

### API Integration
- **Endpoint**: TimezoneDB API for worldwide timezone data
- **HTTP Client**: Axios with configured base URL and interceptors
- **Error Handling**: Graceful fallback to cached data on network errors

### Utilities

#### `clockUtils.ts`
- `convertLocalToZone`: Converts local time to selected timezone
- Handles GMT offset calculations
- Used by AnalogClock to display correct time

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- React Native development environment set up
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd AnalogClock
```

2. **Install dependencies:**
```bash
yarn install
# or
npm install
```

3. **Apply package patches:**
```bash
npx patch-package
```

### iOS Setup

4. **Install CocoaPods dependencies:**
```bash
# Install Ruby bundler (first time only)
bundle install

# Install iOS dependencies
cd ios
bundle exec pod install
cd ..
```

### Running the Application

#### Start Metro Bundler
```bash
yarn start
# or
npm start
```

#### Run on iOS
```bash
yarn ios
# or
npm run ios
```

#### Run on Android
```bash
yarn android
# or
npm run android
```

## 🧪 Development

### Available Scripts

- `yarn start`: Start Metro bundler
- `yarn ios`: Run on iOS simulator
- `yarn android`: Run on Android emulator
- `yarn test`: Run Jest tests
- `yarn lint`: Run ESLint

### Making Changes

The app supports **Fast Refresh** - simply save your changes and see them reflected immediately:

- **Android**: Press R twice or Ctrl+M (Windows/Linux) / Cmd+M (macOS) for Dev Menu
- **iOS**: Press R in iOS Simulator or shake device for Dev Menu

## 🛠️ Build Configuration

### Android Patches
The project includes a patch for `rn-user-defaults` to fix Android build issues:
- Updates `compileSdkVersion` for compatibility
- Applied automatically via `patch-package` on `postinstall`

### Babel Configuration
Custom Babel configuration includes:
- React Native preset
- Reanimated plugin for worklet support

## 🎯 Key Implementation Details

### Animation Strategy
- Uses `react-native-reanimated` for native-driven animations
- Shared values (`useSharedValue`) for performance
- `withTiming` for smooth 300ms transitions between rotations
- Worklets for running animations on UI thread

### State Management
- React hooks for local state management
- Custom hooks encapsulate business logic
- SQLite for persistent storage
- No external state management library needed

### Timezone Handling
- Fetches timezone list from external API
- Caches up to 500 timezones in SQLite
- Calculates time conversion using GMT offsets
- Stores user's last selection for better UX

### Performance Optimizations
- Batch database inserts (50 records at a time)
- Limits cached timezones to 500 entries
- Uses `useAnimatedStyle` to avoid re-renders
- Cleanup intervals on component unmount

## 📝 API Configuration

The app uses the TimezoneDB API. Configure your API endpoint in:
- `src/config/EndPoint.ts`: API endpoint constants
- `src/config/urls.tsx`: Base URL configuration
- `src/config/http.ts`: Axios instance with interceptors

## 🐛 Troubleshooting

### Common Issues

**Metro Bundler Issues:**
```bash
# Clear cache and restart
yarn start --reset-cache
```

**iOS Build Errors:**
```bash
cd ios
bundle exec pod install --repo-update
cd ..
```

**Android Build Errors:**
- Ensure patches are applied: `npx patch-package`
- Clean Android build: `cd android && ./gradlew clean && cd ..`
