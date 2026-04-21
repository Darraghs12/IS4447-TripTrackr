import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {
  activities as activitiesTable,
  categories as categoriesTable,
  trips as tripsTable,
} from './schema';

type Activity = typeof activitiesTable.$inferSelect;
type Trip = typeof tripsTable.$inferSelect;
type Category = typeof categoriesTable.$inferSelect;

function escapeField(value: string | number | null | undefined): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export async function exportActivitiesCSV(
  activities: Activity[],
  trips: Trip[],
  categories: Category[]
): Promise<void> {
  const headers = 'Activity,Trip,Date,Duration,Metric,Category,Notes';

  const rows = activities.map((a) => {
    const trip = trips.find((t) => t.id === a.tripId);
    const category = categories.find((c) => c.id === a.categoryId);
    return [
      escapeField(a.name),
      escapeField(trip?.name),
      escapeField(a.date),
      escapeField(a.duration),
      escapeField(a.metric),
      escapeField(category?.name),
      escapeField(a.notes),
    ].join(',');
  });

  const csv = [headers, ...rows].join('\n');
  const path = (FileSystem.documentDirectory ?? '') + 'triptrackr-activities.csv';

  await FileSystem.writeAsStringAsync(path, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(path, {
    mimeType: 'text/csv',
    dialogTitle: 'Export Activities',
  });
}
