import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, TripContext } from './_layout';

export default function AddTrip() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showCategoryError, setShowCategoryError] = useState(false);

  if (!context) return null;
  const { setTrips, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';

  const saveTrip = async () => {
    if (!categoryId) setShowCategoryError(true);
    if (!name || !destination || !startDate || !endDate || !categoryId) return;

    await db.insert(tripsTable).values({
      name,
      destination,
      startDate,
      endDate,
      categoryId,
      notes: notes || null,
    });

    const rows = await db.select().from(tripsTable);
    setTrips(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <ScreenHeader title="Add Trip" subtitle="Plan a new adventure." />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Destination" value={destination} onChangeText={setDestination} />

          {/* Start Date */}
          <View style={styles.datePickerWrapper}>
            <Text style={styles.datePickerLabel}>Start Date</Text>
            <Pressable
              accessibilityLabel="Select start date"
              accessibilityRole="button"
              onPress={() => setShowStartPicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={[styles.datePickerText, !startDate && styles.datePickerPlaceholder]}>
                {startDate ? formatDate(startDate) : 'Select date'}
              </Text>
            </Pressable>
            {showStartPicker && (
              <>
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  textColor={colorScheme === 'dark' ? '#ECEDEE' : '#111827'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowStartPicker(false);
                    if (selectedDate) setStartDate(new Date(selectedDate).toISOString().split('T')[0]);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <PrimaryButton label="Done" onPress={() => setShowStartPicker(false)} />
                )}
              </>
            )}
          </View>

          {/* End Date */}
          <View style={styles.datePickerWrapper}>
            <Text style={styles.datePickerLabel}>End Date</Text>
            <Pressable
              accessibilityLabel="Select end date"
              accessibilityRole="button"
              onPress={() => setShowEndPicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={[styles.datePickerText, !endDate && styles.datePickerPlaceholder]}>
                {endDate ? formatDate(endDate) : 'Select date'}
              </Text>
            </Pressable>
            {showEndPicker && (
              <>
                <DateTimePicker
                  value={endDate ? new Date(endDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  textColor={colorScheme === 'dark' ? '#ECEDEE' : '#111827'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowEndPicker(false);
                    if (selectedDate) setEndDate(new Date(selectedDate).toISOString().split('T')[0]);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <PrimaryButton label="Done" onPress={() => setShowEndPicker(false)} />
                )}
              </>
            )}
          </View>

          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat: Category) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    accessibilityLabel={`Select category ${cat.name}`}
                    accessibilityRole="button"
                    onPress={() => {
                      setCategoryId(isSelected ? null : cat.id);
                      setShowCategoryError(false);
                    }}
                    style={[
                      styles.chip,
                      isSelected
                        ? { backgroundColor: cat.colour, borderColor: cat.colour }
                        : null,
                    ]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {showCategoryError ? (
              <Text style={styles.categoryError}>Please select a category</Text>
            ) : null}
          </View>

          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>

        <PrimaryButton label="Save Trip" onPress={saveTrip} />
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
  datePickerWrapper: {
    marginBottom: 12,
  },
  datePickerLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  datePickerText: {
    color: '#0F172A',
    fontSize: 14,
  },
  datePickerPlaceholder: {
    color: '#94A3B8',
  },
  chipWrapper: {
    marginBottom: 12,
  },
  chipLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  categoryError: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 4,
  },
});
