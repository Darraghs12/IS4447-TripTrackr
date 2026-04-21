import TripCard from '@/components/TripCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
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

  if (!context) return null;

  const { trips, categories, colorScheme } = context;
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categoryOptions = ['All', ...categories.map((c: Category) => c.name)];

  const filteredTrips = trips.filter((trip: Trip) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      trip.name.toLowerCase().includes(normalizedQuery) ||
      trip.destination.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'All' ||
      categories.find((c: Category) => c.id === trip.categoryId)?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background }]}>
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
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
