import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import { db, sqlite } from './client';
import { activities, categories, targets, trips } from './schema';

// Bump this number whenever seed data changes — forces a fresh reseed on next launch.
const SEED_VERSION = '5';
const SEED_VERSION_KEY = 'triptrackr_seed_version';

export async function seedIfEmpty() {
  const storedVersion = await AsyncStorage.getItem(SEED_VERSION_KEY);

  if (storedVersion === SEED_VERSION) return;

  // Version mismatch — wipe all tables and reset auto-increment counters,
  // then reseed. Resetting sqlite_sequence ensures IDs restart from 1 so
  // hardcoded foreign-key references in the seed data stay correct.
  await db.delete(activities);
  await db.delete(targets);
  await db.delete(trips);
  await db.delete(categories);
  sqlite.execSync(`
    DELETE FROM sqlite_sequence WHERE name IN ('activities','targets','trips','categories');
  `);

  await db.insert(categories).values([
    { name: 'Outdoor', colour: '#0F766E', icon: 'walk-outline' },
    { name: 'Culture', colour: '#1D4ED8', icon: 'camera-outline' },
    { name: 'Sightseeing', colour: '#7C3AED', icon: 'map-outline' },
    { name: 'Food', colour: '#B45309', icon: 'restaurant-outline' },
  ]);

  await db.insert(trips).values([
    {
      name: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      startDate: '2026-03-10',
      endDate: '2026-03-20',
      categoryId: 2,
      notes: 'Cherry blossom season trip',
    },
    {
      name: 'Amsterdam Weekend',
      destination: 'Amsterdam',
      startDate: '2026-06-01',
      endDate: '2026-06-04',
      categoryId: 3,
      notes: 'Canals, museums and cycling',
    },
    {
      name: 'Barcelona City Break',
      destination: 'Barcelona',
      startDate: '2026-05-10',
      endDate: '2026-05-17',
      categoryId: 1,
      notes: 'Architecture and beaches',
    },
    {
      name: 'Barcelona Food Tour',
      destination: 'Barcelona, Spain',
      startDate: '2026-04-14',
      endDate: '2026-04-21',
      categoryId: 4,
      notes: 'Tapas, markets and food tours',
    },
    {
      name: 'Lads Holiday',
      destination: 'Boston',
      startDate: '2026-05-28',
      endDate: '2026-06-05',
      categoryId: 1,
      notes: 'Long weekend with the lads',
    },
    // Weekly-range trips (Apr 15–22) for insights Weekly view
    {
      name: 'Lisbon Weekend',
      destination: 'Lisbon, Portugal',
      startDate: '2026-04-15',
      endDate: '2026-04-17',
      categoryId: 3,
      notes: 'Pastel de nata and history',
    },
    {
      name: 'Dublin City Break',
      destination: 'Dublin, Ireland',
      startDate: '2026-04-19',
      endDate: '2026-04-21',
      categoryId: 2,
      notes: 'Culture and Irish music',
    },
    {
      name: 'Paris Day Trip',
      destination: 'Paris, France',
      startDate: '2026-04-22',
      endDate: '2026-04-22',
      categoryId: 1,
      notes: 'Quick day trip',
    },
  ]);

  await db.insert(activities).values([
    // Tokyo Explorer — March 2026
    {
      tripId: 1,
      name: 'Senso-ji Temple Visit',
      date: '2026-03-11',
      duration: 120,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Morning visit, very peaceful',
    },
    {
      tripId: 1,
      name: 'Shibuya Crossing Walk',
      date: '2026-03-12',
      duration: 60,
      metric: 'minutes',
      categoryId: 1,
      notes: null,
    },
    {
      tripId: 1,
      name: 'Ramen Tasting',
      date: '2026-03-13',
      duration: 90,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Ichiran ramen',
    },
    {
      tripId: 1,
      name: 'Mount Takao Hike',
      date: '2026-03-15',
      duration: 240,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Trail 1, full loop',
    },
    // Barcelona Food Tour — streak days (Apr 20–21)
    {
      tripId: 4,
      name: 'La Boqueria Market',
      date: '2026-04-20',
      duration: 120,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Fresh seafood and fruit',
    },
    {
      tripId: 4,
      name: 'Tapas Bar Crawl',
      date: '2026-04-21',
      duration: 180,
      metric: 'minutes',
      categoryId: 4,
      notes: 'El Born neighbourhood',
    },
    {
      tripId: 4,
      name: 'Sagrada Familia',
      date: '2026-04-21',
      duration: 150,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Booked tickets in advance',
    },
    // Lisbon Weekend (tripId 6) — fills streak gap Apr 15–16
    {
      tripId: 6,
      name: 'Belem Tower',
      date: '2026-04-15',
      duration: 90,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Beautiful riverside monument',
    },
    {
      tripId: 6,
      name: 'Pasteis de Nata Tasting',
      date: '2026-04-16',
      duration: 60,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Best custard tarts in Lisbon',
    },
    // Dublin City Break (tripId 7) — Apr 19–20
    {
      tripId: 7,
      name: 'Trinity College Walk',
      date: '2026-04-19',
      duration: 120,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Book of Kells and library',
    },
    {
      tripId: 7,
      name: 'Guinness Storehouse',
      date: '2026-04-20',
      duration: 90,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Tour and rooftop bar',
    },
    // Paris Day Trip (tripId 8) — today Apr 22, populates Daily view + extends streak
    {
      tripId: 8,
      name: 'Eiffel Tower',
      date: '2026-04-22',
      duration: 120,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Morning visit, beat the crowds',
    },
    {
      tripId: 8,
      name: 'Louvre Museum',
      date: '2026-04-22',
      duration: 180,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Highlights tour',
    },
    // Amsterdam Weekend (tripId 2) — June 2026
    {
      tripId: 2,
      name: 'Anne Frank House',
      date: '2026-06-01',
      duration: 90,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Book tickets well in advance',
    },
    {
      tripId: 2,
      name: 'Canal Boat Tour',
      date: '2026-06-02',
      duration: 120,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Evening cruise through the Jordaan',
    },
    {
      tripId: 2,
      name: 'Rijksmuseum Visit',
      date: '2026-06-03',
      duration: 150,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Rembrandt and Vermeer highlights',
    },
    {
      tripId: 2,
      name: 'Vondelpark Walk',
      date: '2026-06-04',
      duration: 60,
      metric: 'minutes',
      categoryId: 1,
      notes: null,
    },
    // Barcelona City Break (tripId 3) — May 2026
    {
      tripId: 3,
      name: 'Park Güell Visit',
      date: '2026-05-11',
      duration: 150,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Gaudí mosaics and city views',
    },
    {
      tripId: 3,
      name: 'Gothic Quarter Walk',
      date: '2026-05-13',
      duration: 120,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Medieval streets and cathedral',
    },
    {
      tripId: 3,
      name: 'Camp Nou Stadium Tour',
      date: '2026-05-15',
      duration: 90,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Museum and pitch-side access',
    },
    // Lads Holiday — Boston, May–June 2026 (tripId 5)
    {
      tripId: 5,
      name: 'Freedom Trail Walk',
      date: '2026-05-29',
      duration: 150,
      metric: 'minutes',
      categoryId: 1,
      notes: '2.5-mile historic route through downtown',
    },
    {
      tripId: 5,
      name: 'Fenway Park Tour',
      date: '2026-05-30',
      duration: 120,
      metric: 'minutes',
      categoryId: 3,
      notes: 'America\'s oldest ballpark',
    },
    {
      tripId: 5,
      name: 'Harvard Campus Visit',
      date: '2026-06-01',
      duration: 90,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Self-guided walk around Harvard Yard',
    },
    {
      tripId: 5,
      name: 'Boston Harbor Cruise',
      date: '2026-06-02',
      duration: 180,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Sunset cruise past the harbour islands',
    },
    {
      tripId: 5,
      name: 'Duck Boat Tour',
      date: '2026-06-04',
      duration: 90,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Amphibious tour — road and Charles River',
    },
  ]);

  await db.insert(targets).values([
    { type: 'weekly', amount: 3, categoryId: 1 },
    { type: 'monthly', amount: 10, categoryId: null },
    { type: 'weekly', amount: 2, categoryId: 2 },
    { type: 'monthly', amount: 4, categoryId: 4 },
    // Weekly target of 2 (any category) — exceeded by seed activities Apr 16–22
    { type: 'weekly', amount: 2, categoryId: null },
  ]);

  await AsyncStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
}

/**
 * Inserts a sample activity for today if the DB already exists (seedIfEmpty
 * skipped) but has no activity dated today.  Safe to call on every launch —
 * returns immediately if today is already covered.
 */
export async function backfillTodayActivity(): Promise<void> {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const existing = await db.select().from(activities).where(eq(activities.date, todayStr));
  if (existing.length > 0) return;

  // Find the most recently started trip to attach the backfill activity to.
  const tripRows = await db.select().from(trips);
  if (tripRows.length === 0) return;

  const latestTrip = tripRows.sort((a, b) => b.startDate.localeCompare(a.startDate))[0];

  await db.insert(activities).values({
    tripId: latestTrip.id,
    name: "Today's Highlight",
    date: todayStr,
    duration: 60,
    metric: 'minutes',
    categoryId: latestTrip.categoryId ?? null,
    notes: null,
  });
}
