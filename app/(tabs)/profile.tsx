import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colors } from '@/constants/theme';
import { db } from '@/db/client';
import { exportActivitiesCSV } from '@/db/export';
import { users as usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Target, TripContext } from '../_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { trips, activities, categories, targets, currentUser, setCurrentUser, colorScheme, toggleTheme } = context;
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    await db.delete(usersTable).where(eq(usersTable.id, currentUser.id));
    setCurrentUser(null);
    router.replace('/login');
  };

  const handleExport = async () => {
    try {
      await exportActivitiesCSV(activities, trips, categories);
    } catch (e) {
      Alert.alert('Export failed', 'Could not export activities. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Profile"
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
              <Text style={[styles.emptyText, { color: subtitleColor }]}>No targets set - add a goal to track your progress</Text>
            ) : (
              targets.map((target: Target) => (
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
                  <Text style={styles.rowName}>{target.amount} activities per {target.type === 'weekly' ? 'week' : 'month'}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          <View style={styles.themeRow}>
            <Text style={[styles.themeLabel, { color: textColor }]}>Dark Mode</Text>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#0F766E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
          {currentUser ? (
            <Text style={[styles.emailText, { color: subtitleColor }]}>{currentUser.email}</Text>
          ) : null}
          <PrimaryButton
            label="Export Activities"
            variant="secondary"
            onPress={handleExport}
          />
          <View style={styles.dangerButton}>
            <PrimaryButton
              label="Log Out"
              variant="secondary"
              onPress={handleLogout}
            />
          </View>
          <View style={styles.dangerButton}>
            <PrimaryButton
              label="Delete Account"
              variant="danger"
              onPress={handleDeleteAccount}
            />
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
  rowDetail: {
    color: '#6B7280',
    fontSize: 14,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
  emailText: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 12,
  },
  dangerButton: {
    marginTop: 10,
  },
  themeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
});
