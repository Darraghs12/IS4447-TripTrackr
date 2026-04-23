import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { Chip } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;

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
                <Chip
                  key={t}
                  title={t.charAt(0).toUpperCase() + t.slice(1)}
                  onPress={() => setType(t)}
                  containerStyle={{ marginRight: 6, marginBottom: 6 }}
                  buttonStyle={{
                    backgroundColor: type === t ? Colours.primary : Colours.surface,
                    borderColor: type === t ? Colours.primary : Colours.border,
                    borderWidth: 1,
                    borderRadius: 999,
                  }}
                  titleStyle={{
                    color: type === t ? Colours.surface : Colours.textPrimary,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                  type="solid"
                />
              ))}
            </View>
          </View>

          <FormField label="Amount" value={amount} onChangeText={setAmount} placeholder="e.g. 3" />

          <View style={styles.chipWrapper}>
            <Text style={styles.chipLabel}>Category (optional)</Text>
            <View style={styles.chipRow}>
              <Chip
                title="All Categories"
                onPress={() => setCategoryId(null)}
                containerStyle={{ marginRight: 6, marginBottom: 6 }}
                buttonStyle={{
                  backgroundColor: categoryId === null ? Colours.primary : Colours.surface,
                  borderColor: categoryId === null ? Colours.primary : Colours.border,
                  borderWidth: 1,
                  borderRadius: 999,
                }}
                titleStyle={{
                  color: categoryId === null ? Colours.surface : Colours.textPrimary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
                type="solid"
              />

              {categories.map((cat: Category) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Chip
                    key={cat.id}
                    title={cat.name}
                    onPress={() => setCategoryId(isSelected ? null : cat.id)}
                    containerStyle={{ marginRight: 6, marginBottom: 6 }}
                    buttonStyle={{
                      backgroundColor: isSelected ? cat.colour : Colours.surface,
                      borderColor: isSelected ? cat.colour : Colours.border,
                      borderWidth: 1,
                      borderRadius: 999,
                    }}
                    titleStyle={{
                      color: isSelected ? Colours.surface : Colours.textPrimary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                    type="solid"
                  />
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
    color: Colours.labelText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
});
