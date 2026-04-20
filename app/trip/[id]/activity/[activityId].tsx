import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { activities as activitiesTable } from '@/db/schema';
import { Activity, TripContext } from '../../../_layout';

export default function ActivityDetail() {
  const { id, activityId } = useLocalSearchParams<{ id: string; activityId: string }>();
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { activities, setActivities, categories } = context;

  const activity = activities.find((a: Activity) => a.id === Number(activityId));

  if (!activity) return null;

  const category = categories.find((c) => c.id === activity.categoryId);

  const deleteActivity = async () => {
    await db
      .delete(activitiesTable)
      .where(eq(activitiesTable.id, Number(activityId)));

    const rows = await db.select().from(activitiesTable);
    setActivities(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={activity.name} subtitle="Activity details" />
      <View style={styles.tags}>
        <InfoTag label="Date" value={activity.date} />
        <InfoTag label="Duration" value={`${activity.duration} ${activity.metric}`} />
        {category ? <InfoTag label="Category" value={category.name} /> : null}
        {activity.notes ? <InfoTag label="Notes" value={activity.notes} /> : null}
      </View>

      <PrimaryButton
        label="Edit"
        variant="secondary"
        onPress={() =>
          router.push({
            pathname: '/trip/[id]/activity/[activityId]/edit',
            params: { id, activityId },
          })
        }
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="danger" onPress={deleteActivity} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
