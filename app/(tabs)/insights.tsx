import ScreenHeader from '@/components/ui/screen-header';
import { calculateStreak } from '@/db/streaks';
import { useContext, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { Activity, Category, Trip, TripContext } from '../_layout';

type Period = 'Daily' | 'Weekly' | 'Monthly';
const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly'];

export default function InsightsScreen() {
  const context = useContext(TripContext);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Monthly');

  if (!context) return null;

  const { trips, activities, categories, targets, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const periodActivities = activities.filter((a: Activity) => {
    if (selectedPeriod === 'Daily') return a.date === todayStr;
    if (selectedPeriod === 'Weekly') return a.date >= weekAgoStr && a.date <= todayStr;
    return a.date >= monthStart && a.date <= todayStr;
  });

  const periodTripCount = trips.filter((t: Trip) => {
    if (selectedPeriod === 'Daily') return t.startDate === todayStr;
    if (selectedPeriod === 'Weekly') return t.startDate >= weekAgoStr && t.startDate <= todayStr;
    return t.startDate >= monthStart && t.startDate <= todayStr;
  }).length;

  const streak = calculateStreak(activities, targets);

  const totalHours = Math.round(
    periodActivities.reduce((sum: number, a: Activity) => sum + a.duration, 0) / 60
  );

  const barData = categories.map((c: Category) => ({
    value: periodActivities.filter((a: Activity) => a.categoryId === c.id).length,
    label: c.name,
    frontColor: c.colour,
  }));

  const pieData = categories
    .map((c: Category) => ({
      value: periodActivities
        .filter((a: Activity) => a.categoryId === c.id)
        .reduce((sum: number, a: Activity) => sum + a.duration, 0),
      color: c.colour,
      text: c.name.length > 8 ? c.name.slice(0, 7) + '.' : c.name,
      fullName: c.name,
    }))
    .filter((d) => d.value > 0);

  const barEmpty = barData.every((d) => d.value === 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Insights"
          subtitle="Your travel summary"
          textColor={textColor}
          subtitleColor={subtitleColor}
        />

        <View style={styles.filterRow}>
          {PERIODS.map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <Pressable
                key={period}
                accessibilityLabel={`Show ${period.toLowerCase()} stats`}
                accessibilityRole="button"
                onPress={() => setSelectedPeriod(period)}
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
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.streakCard}>
          {streak === 0 ? (
            <Text style={styles.streakEmpty}>No current streak</Text>
          ) : (
            <>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{periodTripCount}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{periodActivities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalHours}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Activities by Category</Text>

        {barEmpty ? (
          <Text style={[styles.emptyText, { color: subtitleColor }]}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <BarChart
              data={barData}
              barWidth={50}
              spacing={16}
              barBorderRadius={6}
              showGradient={false}
              noOfSections={4}
              yAxisTextStyle={styles.axisLabel}
              xAxisLabelTextStyle={styles.axisLabel}
              hideRules
              hideYAxisText={false}
              isAnimated={false}
            />
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: textColor }]}>Time by Category</Text>

        {pieData.length === 0 ? (
          <Text style={[styles.emptyText, { color: subtitleColor }]}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <PieChart
              data={pieData}
              radius={100}
              showText
              textColor="#FFFFFF"
              textSize={11}
              fontWeight="600"
              labelsPosition="outward"
            />
            <View style={styles.legend}>
              {pieData.map((d) => (
                <View key={d.fullName} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                  <Text style={styles.legendLabel}>{d.fullName}</Text>
                </View>
              ))}
            </View>
          </View>
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
  streakCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  streakNumber: {
    color: '#0F766E',
    fontSize: 36,
    fontWeight: '700',
  },
  streakLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  streakEmpty: {
    color: '#6B7280',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  statNumber: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chartCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  axisLabel: {
    color: '#6B7280',
    fontSize: 10,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    marginBottom: 24,
    paddingTop: 8,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 16,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendLabel: {
    color: '#374151',
    fontSize: 12,
  },
});
