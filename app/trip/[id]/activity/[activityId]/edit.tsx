import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { activities as activitiesTable } from '@/db/schema';
import { Activity, TripContext } from '../../../../_layout';

export default function EditActivity() {
  const { id, activityId } = useLocalSearchParams<{ id: string; activityId: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [metric, setMetric] = useState('');
  const [notes, setNotes] = useState('');
  const activity = context?.activities.find(
    (a: Activity) => a.id === Number(activityId)
  );

  useEffect(() => {
    if (!activity) return;
    setName(activity.name);
    setDate(activity.date);
    setDuration(activity.duration.toString());
    setMetric(activity.metric);
    setNotes(activity.notes ?? '');
  }, [activity]);

  if (!context || !activity) return null;

  const { setActivities } = context;

  const saveChanges = async () => {
    if (!name || !date || !duration) return;

    await db
      .update(activitiesTable)
      .set({ name, date, duration: Number(duration), metric, notes })
      .where(eq(activitiesTable.id, Number(activityId)));

    const rows = await db.select().from(activitiesTable);
    setActivities(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Edit Activity" subtitle={`Update ${activity.name}`} />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          <FormField label="Duration" value={duration} onChangeText={setDuration} placeholder="e.g. 90" />
          <FormField label="Metric" value={metric} onChangeText={setMetric} placeholder="e.g. minutes" />
          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
