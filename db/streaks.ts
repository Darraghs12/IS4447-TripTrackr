import { activities as activitiesTable, targets as targetsTable } from './schema';

type Activity = typeof activitiesTable.$inferSelect;
type Target = typeof targetsTable.$inferSelect;

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function calculateStreak(activities: Activity[], _targets: Target[]): number {
  if (activities.length === 0) return 0;

  const activityDates = new Set(activities.map((a) => a.date));

  // Use local time throughout so the date matches the device's calendar day.
  const now = new Date();
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Grace: if nothing has been logged today yet, start counting from yesterday
  // so an active streak isn't broken mid-day.
  if (!activityDates.has(localDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  for (;;) {
    if (!activityDates.has(localDateStr(cursor))) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
