import { activities as activitiesTable, targets as targetsTable } from './schema';

type Activity = typeof activitiesTable.$inferSelect;
type Target = typeof targetsTable.$inferSelect;

function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(activities: Activity[], _targets: Target[]): number {
  if (activities.length === 0) return 0;

  const activityDates = new Set(activities.map((a) => a.date));

  let streak = 0;
  const cursor = new Date();

  for (;;) {
    const dateStr = toLocalDateString(cursor);
    if (!activityDates.has(dateStr)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
