import TripCard from '@/components/TripCard';
import PrimaryButton from '@/components/ui/primary-button';
import { Colours } from '@/constants/colours';
import { formatDate } from '@/db/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip, FAB, Icon } from '@rneui/themed';
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

  const { trips, activities, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : Colours.textPrimary;
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : Colours.textSecondary;
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
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.heroBanner}>
        <Text style={styles.bannerTitle}>Trips</Text>
        <Pressable
          accessibilityLabel="Search trips"
          accessibilityRole="button"
          onPress={() => setShowSearch(true)}
          style={styles.searchIconButton}
        >
          <Icon name="search-outline" type="ionicon" size={24} color={Colours.surface} />
        </Pressable>
      </View>

      <View style={styles.content}>
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
              <Icon name="close-outline" type="ionicon" size={24} color={textColor} />
            </Pressable>
          </View>
        )}

        {/* Trip count */}
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
            <Icon name="options-outline" type="ionicon" size={18} color={Colours.textPrimary} />
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
                      accentColor={Colours.primary}
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
                  <Chip
                    key={option}
                    title={option}
                    onPress={() => setSelectedCategory(option)}
                    containerStyle={{ marginRight: 6, marginBottom: 4 }}
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
                activityCount={activities.filter((a) => a.tripId === trip.id).length}
              />
            ))
          )}
        </ScrollView>
      </View>

      <FAB
        placement="right"
        icon={{ name: 'add', type: 'ionicon', color: Colours.surface }}
        color={Colours.accent}
        onPress={() => router.push({ pathname: '/add-trip' })}
        accessibilityLabel="Add trip"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroBanner: {
    alignItems: 'center',
    backgroundColor: Colours.primary,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bannerTitle: {
    color: Colours.surface,
    fontSize: 22,
    fontWeight: '700',
  },
  searchIconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 14,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
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
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterToggleText: {
    color: Colours.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterDot: {
    backgroundColor: Colours.accent,
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: -2,
    top: -2,
    width: 8,
  },
  dateFilterToggle: {
    alignItems: 'center',
    backgroundColor: Colours.background,
    borderColor: Colours.border,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dateFilterToggleText: {
    color: Colours.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  dateFilterToggleTextActive: {
    color: Colours.primary,
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
    color: Colours.labelText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 10,
  },
  clearButton: {
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
