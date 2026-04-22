import TripCard from '@/components/TripCard';
import PrimaryButton from '@/components/ui/primary-button';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
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
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  if (!context) return null;

  const { trips, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categoryOptions = ['All', ...categories.map((c: Category) => c.name)];

  const hasActiveFilters =
    selectedCategory !== 'All' || fromDate.length > 0 || toDate.length > 0;

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
      {/* Header row: title + search icon */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Trips</Text>
        <Pressable
          accessibilityLabel="Search trips"
          accessibilityRole="button"
          onPress={() => setShowSearch(true)}
          style={styles.searchIconButton}
        >
          <Ionicons name="search-outline" size={24} color={textColor} />
        </Pressable>
      </View>

      {/* Expandable search bar */}
      {showSearch && (
        <View style={styles.searchRow}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or destination"
            style={styles.searchInput}
            autoFocus
          />
          <Pressable
            accessibilityLabel="Close search"
            accessibilityRole="button"
            onPress={() => { setShowSearch(false); setSearchQuery(''); }}
            style={styles.searchCloseButton}
          >
            <Ionicons name="close-outline" size={24} color={textColor} />
          </Pressable>
        </View>
      )}

      {/* Trip count — below search area */}
      <Text style={[styles.tripCount, { color: subtitleColor }]}>
        {trips.length} trips planned
      </Text>

      {/* Filter toggle button */}
      <View style={styles.filterToggleRow}>
        <Pressable
          accessibilityLabel="Toggle filters"
          accessibilityRole="button"
          onPress={() => setShowFilters((v) => !v)}
          style={styles.filterToggle}
        >
          <Ionicons name="options-outline" size={18} color="#0F172A" />
          <Text style={styles.filterToggleText}>Filter</Text>
          {hasActiveFilters && <View style={styles.filterDot} />}
        </Pressable>
      </View>

      {/* Collapsible filters */}
      {showFilters && (
        <>
          {/* Date filter toggle */}
          <Pressable
            accessibilityLabel={fromDate || toDate ? 'Date filter active' : 'Filter by Date'}
            accessibilityRole="button"
            onPress={() => setShowDateFilter((v) => !v)}
            style={styles.dateFilterToggle}
          >
            <Text style={[styles.dateFilterToggleText, (fromDate || toDate) ? styles.dateFilterToggleTextActive : null]}>
              {fromDate || toDate ? 'Date filter active' : 'Filter by Date'}
            </Text>
          </Pressable>

          {showDateFilter && (
            <>
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
                </View>
              </View>

              {/* Shared picker — always at same position regardless of which is active */}
              {(showFromPicker || showToPicker) && (
                <View style={{ backgroundColor: colorScheme === 'dark' ? '#1E2022' : '#F0F0F0', borderRadius: 12, padding: 8, marginTop: 4 }}>
                  <DateTimePicker
                    value={
                      showFromPicker
                        ? (fromDate ? new Date(fromDate) : new Date())
                        : (toDate ? new Date(toDate) : new Date())
                    }
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                    accentColor="#0F766E"
                    onChange={(event: any, selectedDate) => {
                      if (showFromPicker) {
                        if (Platform.OS === 'android') setShowFromPicker(false);
                        if (event.type === 'set' && selectedDate) setFromDate(new Date(selectedDate).toISOString().split('T')[0]);
                      } else {
                        if (Platform.OS === 'android') setShowToPicker(false);
                        if (event.type === 'set' && selectedDate) setToDate(new Date(selectedDate).toISOString().split('T')[0]);
                      }
                    }}
                  />
                  {Platform.OS === 'ios' && (
                    <PrimaryButton
                      label="Done"
                      onPress={() => { setShowFromPicker(false); setShowToPicker(false); }}
                    />
                  )}
                </View>
              )}
            </>
          )}

          {/* Category chips */}
          <View style={styles.filterRow}>
            {categoryOptions.map((option) => {
              const isSelected = selectedCategory === option;
              return (
                <Pressable
                  key={option}
                  accessibilityLabel={`Filter by category ${option}`}
                  accessibilityRole="button"
                  onPress={() => setSelectedCategory(option)}
                  style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
                >
                  <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

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
            <TripCard
              key={trip.id}
              trip={trip}
              category={categories.find((c: Category) => c.id === trip.categoryId)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Trip button */}
      <Pressable
        accessibilityLabel="Add trip"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/add-trip' })}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
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
    paddingBottom: 100,
    paddingTop: 14,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  searchIconButton: {
    padding: 4,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchCloseButton: {
    padding: 4,
  },
  tripCount: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 2,
  },
  filterToggleRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterToggle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterToggleText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterDot: {
    backgroundColor: '#0F766E',
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: -2,
    top: -2,
    width: 8,
  },
  dateFilterToggle: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dateFilterToggleText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  dateFilterToggleTextActive: {
    color: '#0F766E',
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
  fab: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 999,
    bottom: 24,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
  },
});
