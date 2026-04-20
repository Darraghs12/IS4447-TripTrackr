import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { activities as activitiesTable } from '@/db/schema';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from '../../_layout';

export default function AddActivity() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [metric, setMetric] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');

  if (!context) return null;
  const { setActivities } = context;

  const saveActivity = async () => {
    if (!name || !date || !duration || !metric) return;

    await db.insert(activitiesTable).values({
      tripId: Number(id),
      name,
      date,
      duration: Number(duration),
      metric,
      categoryId: categoryId ? Number(categoryId) : null,
      notes: notes || null,
    });

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
        <ScreenHeader title="Add Activity" subtitle="Log a new activity." />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          <FormField label="Duration" value={duration} onChangeText={setDuration} placeholder="e.g. 90" />
          <FormField label="Metric" value={metric} onChangeText={setMetric} placeholder="e.g. minutes" />
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} placeholder="e.g. 1" />
          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>

        <PrimaryButton label="Save Activity" onPress={saveActivity} />
        <View style={styles.backButton}>
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
  backButton: {
    marginTop: 10,
  },
});
