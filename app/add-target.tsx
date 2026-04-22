import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, TripContext } from './_layout';

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  if (!context) return null;
  const { setTargets, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';

  const saveTarget = async () => {
    if (!type || !amount) return;
    await db.insert(targetsTable).values({
      type,
      amount: Number(amount),
      categoryId,
    });

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton colorScheme={colorScheme} />
        <ScreenHeader
          title="Add Target"
          subtitle="Set a goal for number of activities per week or month"
        />
        <View style={styles.form}>
          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Type</Text>
            <View style={styles.chipRow}>
              {(['weekly', 'monthly'] as const).map((t) => (
                <Pressable
                  key={t}
                  accessibilityLabel={`Select type ${t}`}
                  accessibilityRole="button"
                  onPress={() => setType(t)}
                  style={[styles.chip, type === t && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, type === t && styles.chipTextSelected]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <FormField label="Amount" value={amount} onChangeText={setAmount} placeholder="e.g. 3" />

          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Category (optional)</Text>
            <View style={styles.chipRow}>
              {/* All Categories chip */}
              <Pressable
                accessibilityLabel="All categories"
                accessibilityRole="button"
                onPress={() => setCategoryId(null)}
                style={[
                  styles.chip,
                  categoryId === null && styles.chipSelected,
                ]}
              >
                <Text style={[styles.chipText, categoryId === null && styles.chipTextSelected]}>
                  All Categories
                </Text>
              </Pressable>

              {categories.map((cat: Category) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    accessibilityLabel={`Select category ${cat.name}`}
                    accessibilityRole="button"
                    onPress={() => setCategoryId(isSelected ? null : cat.id)}
                    style={[
                      styles.chip,
                      isSelected
                        ? { backgroundColor: cat.colour, borderColor: cat.colour }
                        : null,
                    ]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <PrimaryButton label="Save Target" onPress={saveTarget} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  chipWrapper: {
    marginBottom: 12,
  },
  chipLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
