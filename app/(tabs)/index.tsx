import TripCard from '@/components/TripCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Trip, TripContext } from '../_layout';

export default function TripsScreen() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  if (!context) return null;

  const { trips, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categoryOptions = ['All', ...categories.map((c: Category) => c.name)];

  const isFiltered =
    normalizedQuery.length > 0 ||
    selectedCategory !== 'All' ||
    fromDate.length > 0 ||
    toDate.length > 0;

  const filteredTrips = trips.filter((trip: Trip) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      trip.name.toLowerCase().includes(normalizedQuery) ||
      trip.destination.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'All' ||
      categories.find((c: Category) => c.id === trip.categoryId)?.name === selectedCategory;

    const matchesFrom = fromDate.length === 0 || trip.startDate >= fromDate;
    const matchesTo = toDate.length === 0 || trip.startDate <= toDate;

    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFromDate('');
    setToDate('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScreenHeader
        title="Trips"
        subtitle={`${trips.length} trips planned`}
        textColor={textColor}
        subtitleColor={subtitleColor}
      />

      <PrimaryButton
        label="Add Trip"
        onPress={() => router.push({ pathname: '/add-trip' })}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name or destination"
        style={styles.searchInput}
      />

      <View style={styles.dateRow}>
        {/* From date */}
        <View style={styles.dateField}>
          <Text style={styles.datePickerLabel}>From</Text>
          <Pressable
            accessibilityLabel="Select from date"
            accessibilityRole="button"
            onPress={() => { setShowToPicker(false); setShowFromPicker(true); }}
            style={styles.datePickerButton}
          >
            <Text style={[styles.datePickerText, !fromDate && styles.datePickerPlaceholder]}>
              {fromDate ? formatDate(fromDate) : 'Select date'}
            </Text>
          </Pressable>
          {showFromPicker && (
            <>
              <DateTimePicker
                value={fromDate ? new Date(fromDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                textColor={colorScheme === 'dark' ? '#ECEDEE' : '#111827'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') setShowFromPicker(false);
                  if (selectedDate) setFromDate(new Date(selectedDate).toISOString().split('T')[0]);
                }}
              />
              {Platform.OS === 'ios' && (
                <PrimaryButton label="Done" onPress={() => setShowFromPicker(false)} />
              )}
            </>
          )}
        </View>

        {/* To date */}
        <View style={styles.dateField}>
          <Text style={styles.datePickerLabel}>To</Text>
          <Pressable
            accessibilityLabel="Select to date"
            accessibilityRole="button"
            onPress={() => { setShowFromPicker(false); setShowToPicker(true); }}
            style={styles.datePickerButton}
          >
            <Text style={[styles.datePickerText, !toDate && styles.datePickerPlaceholder]}>
              {toDate ? formatDate(toDate) : 'Select date'}
            </Text>
          </Pressable>
          {showToPicker && (
            <>
              <DateTimePicker
                value={toDate ? new Date(toDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                textColor={colorScheme === 'dark' ? '#ECEDEE' : '#111827'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') setShowToPicker(false);
                  if (selectedDate) setToDate(new Date(selectedDate).toISOString().split('T')[0]);
                }}
              />
              {Platform.OS === 'ios' && (
                <PrimaryButton label="Done" onPress={() => setShowToPicker(false)} />
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {categoryOptions.map((option) => {
          const isSelected = selectedCategory === option;

          return (
            <Pressable
              key={option}
              accessibilityLabel={`Filter by category ${option}`}
              accessibilityRole="button"
              onPress={() => setSelectedCategory(option)}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isFiltered ? (
        <View style={styles.clearButton}>
          <PrimaryButton label="Clear Filters" variant="secondary" onPress={clearFilters} />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <Text style={[styles.emptyText, { color: subtitleColor }]}>No trips found</Text>
        ) : (
          filteredTrips.map((trip: Trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  dateField: {
    flex: 1,
  },
  datePickerLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: 10,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
