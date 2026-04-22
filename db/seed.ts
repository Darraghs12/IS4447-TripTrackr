import { eq } from 'drizzle-orm';
import { db } from './client';
import { activities, categories, targets, trips } from './schema';

export async function seedIfEmpty() {
  const existing = await db.select().from(categories);

  if (existing.length > 0) {
    return;
  }

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
      name: 'Amalfi Coast',
      destination: 'Amalfi, Italy',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
      categoryId: 3,
      notes: 'Summer relaxation holiday',
    },
    {
      name: 'Patagonia Trek',
      destination: 'Patagonia, Argentina',
      startDate: '2026-04-10',
      endDate: '2026-04-25',
      categoryId: 1,
      notes: 'Torres del Paine circuit',
    },
    {
      name: 'Barcelona Food Tour',
      destination: 'Barcelona, Spain',
      startDate: '2026-04-14',
      endDate: '2026-04-21',
      categoryId: 4,
      notes: 'Tapas, markets and food tours',
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
    // Amalfi Coast — June 2026 (upcoming)
    {
      tripId: 2,
      name: 'Boat Tour to Positano',
      date: '2026-06-02',
      duration: 180,
      metric: 'minutes',
      categoryId: 3,
      notes: null,
    },
    {
      tripId: 2,
      name: 'Villa Rufolo Gardens',
      date: '2026-06-04',
      duration: 90,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Stunning views',
    },
    // Patagonia Trek — streak days 1, 2, 3 (Apr 17–19)
    {
      tripId: 3,
      name: 'W Trek Day 1',
      date: '2026-04-17',
      duration: 480,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Mirador Las Torres',
    },
    {
      tripId: 3,
      name: 'W Trek Day 2',
      date: '2026-04-18',
      duration: 420,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Valle del Frances',
    },
    {
      tripId: 3,
      name: 'Grey Glacier Walk',
      date: '2026-04-19',
      duration: 300,
      metric: 'minutes',
      categoryId: 1,
      notes: null,
    },
    // Barcelona Food Tour — streak days 4, 5 (Apr 20–21)
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
    // Lisbon Weekend (tripId 5) — fills streak gap Apr 15–16
    {
      tripId: 5,
      name: 'Belem Tower',
      date: '2026-04-15',
      duration: 90,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Beautiful riverside monument',
    },
    {
      tripId: 5,
      name: 'Pasteis de Nata Tasting',
      date: '2026-04-16',
      duration: 60,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Best custard tarts in Lisbon',
    },
    // Dublin City Break (tripId 6) — Apr 19–20
    {
      tripId: 6,
      name: 'Trinity College Walk',
      date: '2026-04-19',
      duration: 120,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Book of Kells and library',
    },
    {
      tripId: 6,
      name: 'Guinness Storehouse',
      date: '2026-04-20',
      duration: 90,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Tour and rooftop bar',
    },
    // Paris Day Trip (tripId 7) — today Apr 22, populates Daily view + extends streak
    {
      tripId: 7,
      name: 'Eiffel Tower',
      date: '2026-04-22',
      duration: 120,
      metric: 'minutes',
      categoryId: 3,
      notes: 'Morning visit, beat the crowds',
    },
    {
      tripId: 7,
      name: 'Louvre Museum',
      date: '2026-04-22',
      duration: 180,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Highlights tour',
    },
  ]);

  await db.insert(targets).values([
    { type: 'weekly', amount: 3, categoryId: 1 },
    { type: 'monthly', amount: 10, categoryId: null },
    { type: 'weekly', amount: 2, categoryId: 2 },
    { type: 'monthly', amount: 4, categoryId: 4 },
  ]);
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
