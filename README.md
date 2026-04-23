# TripTrackr

**IS4447 Mobile Application Development — Option B: Holiday/Trip Planner**  
**Student Number:** 122305986

---

## Links

**GitHub Repository:** https://github.com/Darraghs12/IS4447-TripTrackr

**Expo Link:** exp://u.expo.dev/2d78bbc7-f1d4-4fdb-8912-5589ca23c687/group/ef0e3b77-cc96-4bf5-bdf8-682d20f3dc38 

**Expo QR Code:** (https://expo.dev/preview/update?message=submission&updateRuntimeVersion=1.0.0&createdAt=2026-04-23T20%3A08%3A23.915Z&slug=exp&projectId=2d78bbc7-f1d4-4fdb-8912-5589ca23c687&group=ef0e3b77 -cc96-4bf5-bdf8-682d20f3dc38 )

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
