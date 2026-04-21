import ScreenHeader from '@/components/ui/screen-header';
import { Colors } from '@/constants/theme';
import { calculateStreak } from '@/db/streaks';
import { useContext } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie } from 'victory-native';
import { Activity, Category, TripContext } from '../_layout';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function InsightsScreen() {
  const context = useContext(TripContext);

  if (!context) return null;

  const { trips, activities, categories, targets, colorScheme } = context;
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';

  const streak = calculateStreak(activities, targets);

  const totalHours = Math.round(
    activities.reduce((sum: number, a: Activity) => sum + a.duration, 0) / 60
  );

  const barData = categories.map((c: Category) => ({
    x: c.name,
    y: activities.filter((a: Activity) => a.categoryId === c.id).length,
  }));

  const pieData = categories
    .map((c: Category) => ({
      x: c.name,
      y: activities
        .filter((a: Activity) => a.categoryId === c.id)
        .reduce((sum: number, a: Activity) => sum + a.duration, 0),
    }))
    .filter((d) => d.y > 0);

  const pieColours = categories
    .filter((c: Category) =>
      activities.some((a: Activity) => a.categoryId === c.id)
    )
    .map((c: Category) => c.colour);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background }]}>
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
            <Text style={styles.statNumber}>{trips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalHours}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Activities by Category</Text>

        {barData.length === 0 ? (
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
