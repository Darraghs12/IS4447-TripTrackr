# TripTrackr

**IS4447 Mobile Application Development — Option B: Holiday/Trip Planner**  
**Student Number:** 122305986

---

## Links

**GitHub Repository:** https://github.com/Darraghs12/IS4447-TripTrackr

**Expo Link:** [INSERT EXPO LINK HERE]

**Expo QR Code:** [INSERT QR CODE OR LINK HERE]

---

## App Overview

TripTrackr is a mobile app that allows users to plan and track holidays and trips. Users can create trips, log activities within each trip, organise them using categories, set weekly and monthly targets, and view insights and charts summarising their travel activity.

---

## Setup Instructions

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on iOS or Android.

---

## Features

- Add, edit, and delete trips and activities
- Categories with colour and icon
- Weekly and monthly targets with progress tracking
- Insights screen with bar and pie charts
- Search and filter trips by text, date range, and category
- Light and dark mode with local persistence
- Weather and map for trip destination via Open-Meteo and OpenStreetMap
- Local notifications for trip reminders
- Streak tracking for consecutive days of activity
- CSV export of activity data
- Login, register, logout, and delete account

---

## Tech Stack

- React Native + Expo (expo-router)
- Drizzle ORM + SQLite (expo-sqlite)
- TypeScript
- react-native-gifted-charts
- bcryptjs + expo-crypto
- AsyncStorage
- expo-notifications
- expo-sharing + expo-file-system
- react-native-webview (Leaflet.js map)
