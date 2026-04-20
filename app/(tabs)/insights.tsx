import ScreenHeader from '@/components/ui/screen-header';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Category, TripContext } from '../_layout';

export default function InsightsScreen() {
  const context = useContext(TripContext);

  if (!context) return null;

  const { trips, activities, categories } = context;

  const activityCountByCategory = categories.map((category: Category) => {
    const count = activities.filter(
      (a: Activity) => a.categoryId === category.id
    ).length;
    return { category, count };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Insights" subtitle="Your travel summary" />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{trips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Activities by Category</Text>

        {activityCountByCategory.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet</Text>
        ) : (
          activityCountByCategory.map(({ category, count }) => (
            <View key={category.id} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{count}</Text>
            </View>
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
  content: {
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 20,
  },
  statNumber: {
    color: '#111827',
    fontSize: 36,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryRow: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  categoryCount: {
    color: '#6B7280',
    fontSize: 15,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
