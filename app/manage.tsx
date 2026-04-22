import BackButton from '@/components/ui/back-button';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Category, Target, TripContext } from './_layout';

export default function ManageScreen() {
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { activities, categories, targets, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const getTargetCount = (target: Target): number =>
    activities.filter((a: Activity) => {
      const fromDate = target.type === 'weekly' ? weekAgoStr : monthStart;
      const inPeriod = a.date >= fromDate && a.date <= todayStr;
      const inCategory = target.categoryId == null || a.categoryId === target.categoryId;
      return inPeriod && inCategory;
    }).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton colorScheme={colorScheme} />
        <ScreenHeader
          title="Manage"
          subtitle="Categories and targets"
          textColor={textColor}
          subtitleColor={subtitleColor}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Categories</Text>
          <PrimaryButton
            label="Add Category"
            onPress={() => router.push({ pathname: '/add-category' })}
          />
          <View style={styles.list}>
            {categories.length === 0 ? (
              <Text style={[styles.emptyText, { color: subtitleColor }]}>No categories yet</Text>
            ) : (
              categories.map((category: Category) => (
                <Pressable
                  key={category.id}
                  accessibilityLabel={`${category.name}, view category`}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: '/category/[id]',
                      params: { id: category.id.toString() },
                    })
                  }
                  style={({ pressed }) => [
                    styles.row,
                    pressed ? styles.rowPressed : null,
                  ]}
                >
                  <View style={styles.rowContent}>
                    <View style={[styles.colourDot, { backgroundColor: category.colour }]} />
                    <Ionicons
                      name={(category.icon ?? 'map-outline') as any}
                      size={18}
                      color={category.colour}
                    />
                    <Text style={styles.rowName}>{category.name}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Targets</Text>
          <PrimaryButton
            label="Add Target"
            onPress={() => router.push({ pathname: '/add-target' })}
          />
          <View style={styles.list}>
            {targets.length === 0 ? (
              <Text style={[styles.emptyText, { color: subtitleColor }]}>
                No targets set — add a goal to track your progress
              </Text>
            ) : (
              targets.map((target: Target) => {
                const count = getTargetCount(target);
                const exceeded = count > target.amount;
                const met = count === target.amount;
                const remaining = target.amount - count;
                const isAchieved = count >= target.amount;
                return (
                  <Pressable
                    key={target.id}
                    accessibilityLabel={`${target.amount} activities per ${target.type === 'weekly' ? 'week' : 'month'}, view details`}
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/target/[id]',
                        params: { id: target.id.toString() },
                      })
                    }
                    style={({ pressed }) => [
                      styles.row,
                      pressed ? styles.rowPressed : null,
                    ]}
                  >
                    <View
                      style={[
                        styles.progressStrip,
                        { backgroundColor: isAchieved ? '#0F766E' : '#94A3B8' },
                      ]}
                    />
                    <Text style={styles.rowName}>
                      {target.amount} activities per {target.type === 'weekly' ? 'week' : 'month'}
                      {target.categoryId
                        ? ` — ${categories.find((c: Category) => c.id === target.categoryId)?.name ?? ''}`
                        : ''}
                    </Text>
                    <View style={styles.progressLabels}>
                      {(met || exceeded) && (
                        <Text style={styles.progressMet}>Target met!</Text>
                      )}
                      {exceeded && (
                        <Text style={styles.progressExceeded}>
                          Exceeded by {count - target.amount}
                        </Text>
                      )}
                      {!isAchieved && (
                        <Text style={styles.progressRemaining}>{remaining} remaining</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  list: {
    marginTop: 12,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowPressed: {
    opacity: 0.88,
  },
  rowContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  colourDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  rowName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
  progressStrip: {
    bottom: 0,
    borderRadius: 2,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  progressLabels: {
    alignItems: 'flex-end',
  },
  progressMet: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '600',
  },
  progressExceeded: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700',
  },
  progressRemaining: {
    color: '#6B7280',
    fontSize: 13,
  },
});
