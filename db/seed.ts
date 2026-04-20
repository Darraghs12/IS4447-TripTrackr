import { db } from './client';
import { activities, categories, targets, trips } from './schema';

export async function seedIfEmpty() {
  const existing = await db.select().from(categories);

  if (existing.length > 0) {
    return;
  }

  await db.insert(categories).values([
    { name: 'Outdoor', colour: '#0F766E' },
    { name: 'Culture', colour: '#1D4ED8' },
    { name: 'Sightseeing', colour: '#7C3AED' },
    { name: 'Food', colour: '#B45309' },
  ]);

  await db.insert(trips).values([
    {
      name: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      startDate: '2024-03-10',
      endDate: '2024-03-20',
      categoryId: 2,
      notes: 'Cherry blossom season trip',
    },
    {
      name: 'Amalfi Coast',
      destination: 'Amalfi, Italy',
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      categoryId: 3,
      notes: 'Summer relaxation holiday',
    },
    {
      name: 'Patagonia Trek',
      destination: 'Patagonia, Argentina',
      startDate: '2024-11-05',
      endDate: '2024-11-18',
      categoryId: 1,
      notes: 'Torres del Paine circuit',
    },
    {
      name: 'Barcelona Food Tour',
      destination: 'Barcelona, Spain',
      startDate: '2025-02-14',
      endDate: '2025-02-21',
      categoryId: 4,
      notes: 'Tapas, markets and food tours',
    },
  ]);

  await db.insert(activities).values([
    {
      tripId: 1,
      name: 'Senso-ji Temple Visit',
      date: '2024-03-11',
      duration: 120,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Morning visit, very peaceful',
    },
    {
      tripId: 1,
      name: 'Shibuya Crossing Walk',
      date: '2024-03-12',
      duration: 60,
      metric: 'minutes',
      categoryId: 1,
      notes: null,
    },
    {
      tripId: 1,
      name: 'Ramen Tasting',
      date: '2024-03-13',
      duration: 90,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Ichiran ramen',
    },
    {
      tripId: 1,
      name: 'Mount Takao Hike',
      date: '2024-03-15',
      duration: 240,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Trail 1, full loop',
    },
    {
      tripId: 2,
      name: 'Boat Tour to Positano',
      date: '2024-06-02',
      duration: 180,
      metric: 'minutes',
      categoryId: 3,
      notes: null,
    },
    {
      tripId: 2,
      name: 'Villa Rufolo Gardens',
      date: '2024-06-04',
      duration: 90,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Stunning views',
    },
    {
      tripId: 3,
      name: 'W Trek Day 1',
      date: '2024-11-06',
      duration: 480,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Mirador Las Torres',
    },
    {
      tripId: 3,
      name: 'W Trek Day 2',
      date: '2024-11-07',
      duration: 420,
      metric: 'minutes',
      categoryId: 1,
      notes: 'Valle del Frances',
    },
    {
      tripId: 3,
      name: 'Grey Glacier Walk',
      date: '2024-11-09',
      duration: 300,
      metric: 'minutes',
      categoryId: 1,
      notes: null,
    },
    {
      tripId: 4,
      name: 'La Boqueria Market',
      date: '2025-02-15',
      duration: 120,
      metric: 'minutes',
      categoryId: 4,
      notes: 'Fresh seafood and fruit',
    },
    {
      tripId: 4,
      name: 'Tapas Bar Crawl',
      date: '2025-02-16',
      duration: 180,
      metric: 'minutes',
      categoryId: 4,
      notes: 'El Born neighbourhood',
    },
    {
      tripId: 4,
      name: 'Sagrada Familia',
      date: '2025-02-17',
      duration: 150,
      metric: 'minutes',
      categoryId: 2,
      notes: 'Booked tickets in advance',
    },
  ]);

  await db.insert(targets).values([
    { type: 'weekly', amount: 3, categoryId: 1 },
    { type: 'monthly', amount: 10, categoryId: null },
    { type: 'weekly', amount: 2, categoryId: 2 },
    { type: 'monthly', amount: 4, categoryId: 4 },
  ]);
}
