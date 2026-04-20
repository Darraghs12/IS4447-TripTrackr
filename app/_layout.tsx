import { db } from '@/db/client';
import {
  activities as activitiesTable,
  categories as categoriesTable,
  targets as targetsTable,
  trips as tripsTable,
} from '@/db/schema';
import { seedIfEmpty } from '@/db/seed';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

export type Trip = typeof tripsTable.$inferSelect;
export type Activity = typeof activitiesTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type Target = typeof targetsTable.$inferSelect;

type TripContextType = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  targets: Target[];
  setTargets: (targets: Target[]) => void;
};

export const TripContext = createContext<TripContextType | null>(null);

export default function RootLayout() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    async function load() {
      await seedIfEmpty();
      const tripRows = await db.select().from(tripsTable);
      const activityRows = await db.select().from(activitiesTable);
      const categoryRows = await db.select().from(categoriesTable);
      const targetRows = await db.select().from(targetsTable);
      setTrips(tripRows);
      setActivities(activityRows);
      setCategories(categoryRows);
      setTargets(targetRows);
    }
    load();
  }, []);

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
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </TripContext.Provider>
  );
}
