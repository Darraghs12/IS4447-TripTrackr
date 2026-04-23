import BackButton from '@/components/ui/back-button';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { Icon, ListItem } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Category, Target, TripContext } from './_layout';

export default function ManageScreen() {
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { activities, categories, targets, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : Colours.textPrimary;
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : Colours.textSecondary;

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
                <ListItem
                  key={category.id}
                  accessibilityLabel={`${category.name}, view category`}
                  onPress={() =>
                    router.push({
                      pathname: '/category/[id]',
                      params: { id: category.id.toString() },
                    })
                  }
                  containerStyle={styles.row}
                  bottomDivider={false}
                >
                  <View style={[styles.colourDot, { backgroundColor: category.colour }]} />
                  <Icon
                    name={(category.icon ?? 'map-outline') as any}
                    type="ionicon"
                    size={18}
                    color={category.colour}
                  />
                  <ListItem.Content>
                    <ListItem.Title style={styles.rowName}>{category.name}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron color={Colours.border} />
                </ListItem>
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
                  <ListItem
                    key={target.id}
                    accessibilityLabel={`${target.amount} activities per ${target.type === 'weekly' ? 'week' : 'month'}, view details`}
                    onPress={() =>
                      router.push({
                        pathname: '/target/[id]',
                        params: { id: target.id.toString() },
                      })
                    }
                    containerStyle={[styles.row, { paddingLeft: 18 }]}
                    bottomDivider={false}
                  >
                    <View
                      style={[
                        styles.progressStrip,
                        { backgroundColor: isAchieved ? Colours.success : Colours.border },
                      ]}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.rowName}>
                        {target.amount} activities per {target.type === 'weekly' ? 'week' : 'month'}
                        {target.categoryId
                          ? ` — ${categories.find((c: Category) => c.id === target.categoryId)?.name ?? ''}`
                          : ''}
                      </ListItem.Title>
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
                    </ListItem.Content>
                    <ListItem.Chevron color={Colours.border} />
                  </ListItem>
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  list: {
    marginTop: 12,
  },
  row: {
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  colourDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
    marginRight: 4,
  },
  rowName: {
    color: Colours.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  emptyText: {
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
    marginTop: 2,
  },
  progressMet: {
    color: Colours.success,
    fontSize: 13,
    fontWeight: '600',
  },
  progressExceeded: {
    color: Colours.success,
    fontSize: 13,
    fontWeight: '700',
  },
  progressRemaining: {
    color: Colours.textSecondary,
    fontSize: 13,
  },
});
