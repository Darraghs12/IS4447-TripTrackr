import ScreenHeader from '@/components/ui/screen-header';
import { calculateStreak } from '@/db/streaks';
import { useContext, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie } from 'victory-native';
import { Activity, Category, Trip, TripContext } from '../_layout';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
    x: c.name,
    y: periodActivities.filter((a: Activity) => a.categoryId === c.id).length,
  }));

  const pieData = categories
    .map((c: Category) => ({
      x: c.name,
      y: periodActivities
        .filter((a: Activity) => a.categoryId === c.id)
        .reduce((sum: number, a: Activity) => sum + a.duration, 0),
    }))
    .filter((d) => d.y > 0);

  const pieColours = categories
    .filter((c: Category) =>
      periodActivities.some((a: Activity) => a.categoryId === c.id)
    )
    .map((c: Category) => c.colour);

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

        {barData.every((d) => d.y === 0) ? (
          <Text style={[styles.emptyText, { color: subtitleColor }]}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <VictoryChart
              width={SCREEN_WIDTH - 56}
              height={220}
              domainPadding={{ x: 20 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: '#E5E7EB' },
                  grid: { stroke: 'transparent' },
                  tickLabels: { angle: -20, fill: '#6B7280', fontSize: 10 },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: '#E5E7EB' },
                  grid: { stroke: '#F3F4F6' },
                  tickLabels: { fill: '#6B7280', fontSize: 10 },
                }}
              />
              <VictoryBar
                data={barData}
                style={{ data: { fill: '#0F766E' } }}
              />
            </VictoryChart>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: textColor }]}>Time by Category</Text>

        {pieData.length === 0 ? (
          <Text style={[styles.emptyText, { color: subtitleColor }]}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <VictoryPie
              data={pieData}
              width={SCREEN_WIDTH - 56}
              height={240}
              colorScale={
                pieColours.length > 0
                  ? pieColours
                  : ['#0F766E', '#1D4ED8', '#7C3AED', '#B45309']
              }
              innerRadius={40}
              padAngle={2}
              style={{
                labels: { fill: '#374151', fontSize: 11, fontWeight: '600' },
              }}
            />
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
    paddingVertical: 8,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    marginBottom: 24,
    paddingTop: 8,
    textAlign: 'center',
  },
});
