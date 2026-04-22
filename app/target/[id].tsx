import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import BackButton from '@/components/ui/back-button';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { Target, TripContext } from '../_layout';

export default function TargetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { targets, setTargets, categories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';

  const target = targets.find((t: Target) => t.id === Number(id));

  if (!target) return null;

  const category = categories.find((c) => c.id === target.categoryId);

  const deleteTarget = async () => {
    await db
      .delete(targetsTable)
      .where(eq(targetsTable.id, Number(id)));

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <BackButton />
      <ScreenHeader title={`${target.type} target`} subtitle="Goal details" />
      <View style={styles.tags}>
        <InfoTag label="Type" value={target.type} />
        <InfoTag label="Amount" value={target.amount.toString()} />
        {category ? <InfoTag label="Category" value={category.name} /> : null}
      </View>

      <PrimaryButton label="Delete" variant="danger" onPress={deleteTarget} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
});
