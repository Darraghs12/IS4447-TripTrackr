import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from './_layout';

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (!context) return null;
  const { setTargets, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';

  const saveTarget = async () => {
    await db.insert(targetsTable).values({
      type,
      amount: Number(amount),
      categoryId: categoryId ? Number(categoryId) : null,
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
          <FormField label="Type" value={type} onChangeText={setType} placeholder="weekly or monthly" />
          <FormField label="Amount" value={amount} onChangeText={setAmount} placeholder="e.g. 3" />
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} placeholder="Optional" />
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
});
