import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Target, TripContext } from '../_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { categories, targets } = context;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Profile" subtitle="Categories and targets" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <PrimaryButton
            label="Add Category"
            onPress={() => router.push({ pathname: '/add-category' })}
          />
          <View style={styles.list}>
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>No categories yet</Text>
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
                  <Text style={styles.rowName}>{category.name}</Text>
                  <Text style={styles.rowDetail}>{category.colour}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Targets</Text>
          <PrimaryButton
            label="Add Target"
            onPress={() => router.push({ pathname: '/add-target' })}
          />
          <View style={styles.list}>
            {targets.length === 0 ? (
              <Text style={styles.emptyText}>No targets yet</Text>
            ) : (
              targets.map((target: Target) => (
                <Pressable
                  key={target.id}
                  accessibilityLabel={`${target.type} target, ${target.amount} activities, view details`}
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
                  <Text style={styles.rowName}>{target.type}</Text>
                  <Text style={styles.rowDetail}>{target.amount} activities</Text>
                </Pressable>
              ))
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
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowPressed: {
    opacity: 0.88,
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
});
