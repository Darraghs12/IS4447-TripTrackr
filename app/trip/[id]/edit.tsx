import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip } from '@rneui/themed';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { Category, Trip, TripContext } from '../../_layout';

function safeDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? new Date() : date;
}

export default function EditTrip() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
  const trip = context?.trips.find(
    (t: Trip) => t.id === Number(id)
  );

  useEffect(() => {
    if (!trip) return;
    setName(trip.name);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setCategoryId(trip.categoryId ?? null);
    setNotes(trip.notes ?? '');
  }, [trip]);

  if (!context || !trip) return null;

  const { setTrips, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;

  const saveChanges = async () => {
    await db
      .update(tripsTable)
      .set({ name, destination, startDate, endDate, categoryId, notes })
      .where(eq(tripsTable.id, Number(id)));

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
        <BackButton colorScheme={colorScheme} />
        <ScreenHeader title="Edit Trip" subtitle={`Update ${trip.name}`} />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Destination" value={destination} onChangeText={setDestination} placeholder="e.g. Paris, Tokyo, New York" />
          <Text style={styles.hint}>Enter a city name for weather to work correctly.</Text>

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
              <View style={{ backgroundColor: colorScheme === 'dark' ? '#1E2022' : '#F0F0F0', borderRadius: 12, padding: 8, marginTop: 4 }}>
                <DateTimePicker
                  value={safeDate(startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                  accentColor={Colours.primary}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowStartPicker(false);
                    if (selectedDate) setStartDate(new Date(selectedDate).toISOString().split('T')[0]);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <PrimaryButton label="Done" onPress={() => setShowStartPicker(false)} />
                )}
              </View>
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
              <View style={{ backgroundColor: colorScheme === 'dark' ? '#1E2022' : '#F0F0F0', borderRadius: 12, padding: 8, marginTop: 4 }}>
                <DateTimePicker
                  value={safeDate(endDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                  accentColor={Colours.primary}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowEndPicker(false);
                    if (selectedDate) setEndDate(new Date(selectedDate).toISOString().split('T')[0]);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <PrimaryButton label="Done" onPress={() => setShowEndPicker(false)} />
                )}
              </View>
            )}
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
                    onPress={() => setCategoryId(isSelected ? null : cat.id)}
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
          </View>

          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />
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
  hint: {
    color: Colours.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});
