import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { db } from '@/db/client';
import { activities as activitiesTable } from '@/db/schema';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, TripContext } from '../../_layout';

const METRICS = [
  { label: 'Minutes', value: 'minutes' },
  { label: 'Hours', value: 'hours' },
  { label: 'Steps', value: 'steps' },
  { label: 'km', value: 'km' },
];

export default function AddActivity() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [metric, setMetric] = useState('minutes');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showCategoryError, setShowCategoryError] = useState(false);

  if (!context) return null;
  const { setActivities, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;

  const saveActivity = async () => {
    if (!categoryId) setShowCategoryError(true);
    if (!name || !date || !categoryId) return;

    await db.insert(activitiesTable).values({
      tripId: Number(id),
      name,
      date,
      duration: duration ? Number(duration) : 0,
      metric: metric || 'minutes',
      categoryId,
      notes: notes || null,
    });

    const rows = await db.select().from(activitiesTable);
    setActivities(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton colorScheme={colorScheme} />
        <ScreenHeader title="Add Activity" subtitle="Log a new activity." />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          <View style={styles.datePickerWrapper}>
            <Text style={styles.datePickerLabel}>Date</Text>
            <Pressable
              accessibilityLabel="Select activity date"
              accessibilityRole="button"
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={[styles.datePickerText, !date && styles.datePickerPlaceholder]}>
                {date ? formatDate(date) : 'Select date'}
              </Text>
            </Pressable>
            {showDatePicker && (
              <View style={{ backgroundColor: colorScheme === 'dark' ? '#1E2022' : '#F0F0F0', borderRadius: 12, padding: 8, marginTop: 4 }}>
                <DateTimePicker
                  value={date ? new Date(date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                  accentColor={Colours.primary}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowDatePicker(false);
                    if (selectedDate) setDate(new Date(selectedDate).toISOString().split('T')[0]);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <PrimaryButton label="Done" onPress={() => setShowDatePicker(false)} />
                )}
              </View>
            )}
          </View>

          <FormField label="Duration" value={duration} onChangeText={setDuration} placeholder="e.g. 90" />

          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Metric</Text>
            <View style={styles.chipRow}>
              {METRICS.map((m) => {
                const isSelected = metric === m.value;
                return (
                  <Chip
                    key={m.value}
                    title={m.label}
                    onPress={() => setMetric(m.value)}
                    containerStyle={{ marginRight: 6, marginBottom: 6 }}
                    buttonStyle={{
                      backgroundColor: isSelected ? Colours.primary : Colours.surface,
                      borderColor: isSelected ? Colours.primary : Colours.border,
                      borderWidth: 1,
                      borderRadius: 999,
                    }}
                    titleStyle={{
                      color: isSelected ? Colours.surface : Colours.textPrimary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                    type="solid"
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat: Category) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Chip
                    key={cat.id}
                    title={cat.name}
                    onPress={() => {
                      setCategoryId(isSelected ? null : cat.id);
                      setShowCategoryError(false);
                    }}
                    containerStyle={{ marginRight: 6, marginBottom: 6 }}
                    buttonStyle={{
                      backgroundColor: isSelected ? cat.colour : Colours.surface,
                      borderColor: isSelected ? cat.colour : Colours.border,
                      borderWidth: 1,
                      borderRadius: 999,
                    }}
                    titleStyle={{
                      color: isSelected ? Colours.surface : Colours.textPrimary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                    type="solid"
                  />
                );
              })}
            </View>
            {showCategoryError ? (
              <Text style={styles.categoryError}>Please select a category</Text>
            ) : null}
          </View>

          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>

        <PrimaryButton label="Save Activity" onPress={saveActivity} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  datePickerWrapper: {
    marginBottom: 12,
  },
  datePickerLabel: {
    color: Colours.labelText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  datePickerButton: {
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  datePickerText: {
    color: Colours.textPrimary,
    fontSize: 14,
  },
  datePickerPlaceholder: {
    color: Colours.textSecondary,
  },
  chipWrapper: {
    marginBottom: 12,
  },
  chipLabel: {
    color: Colours.labelText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryError: {
    color: Colours.danger,
    fontSize: 13,
    marginTop: 4,
  },
});
