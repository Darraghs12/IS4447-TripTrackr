import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/db/client';
import * as Notifications from 'expo-notifications';
import {
  activities as activitiesTable,
  categories as categoriesTable,
  targets as targetsTable,
  trips as tripsTable,
  users as usersTable,
} from '@/db/schema';
import { backfillTodayActivity, seedIfEmpty } from '@/db/seed';
import { ColorScheme } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

export type Trip = typeof tripsTable.$inferSelect;
export type Activity = typeof activitiesTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type Target = typeof targetsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const THEME_KEY = 'triptrackr_theme';

type TripContextType = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  targets: Target[];
  setTargets: (targets: Target[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
};

export const TripContext = createContext<TripContextType | null>(null);

export default function RootLayout() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      await Notifications.requestPermissionsAsync();
      await seedIfEmpty();
      await backfillTodayActivity();
      const tripRows = await db.select().from(tripsTable);
      const activityRows = await db.select().from(activitiesTable);
      const categoryRows = await db.select().from(categoriesTable);
      const targetRows = await db.select().from(targetsTable);
      setTrips(tripRows);
      setActivities(activityRows);
      setCategories(categoryRows);
      setTargets(targetRows);

      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        setColorScheme(saved);
      }

      setIsReady(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!currentUser) {
      router.replace('/login');
    }
  }, [isReady, currentUser]);

  const toggleTheme = async () => {
    const next: ColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        setTrips,
        activities,
        setActivities,
        categories,
        setCategories,
        targets,
        setTargets,
        currentUser,
        setCurrentUser,
        colorScheme,
        toggleTheme,
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </TripContext.Provider>
  );
}
