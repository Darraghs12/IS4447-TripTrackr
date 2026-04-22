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
import { categories as categoriesTable } from '@/db/schema';
import { Category, TripContext } from '../_layout';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { categories, setCategories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';

  const category = categories.find((c: Category) => c.id === Number(id));

  if (!category) return null;

  const deleteCategory = async () => {
    await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <BackButton />
      <ScreenHeader title={category.name} subtitle="Category details" />
      <View style={styles.tags}>
        <InfoTag label="Name" value={category.name} />
        <InfoTag label="Colour" value={category.colour} />
      </View>

      <PrimaryButton
        label="Edit"
        variant="secondary"
        onPress={() =>
          router.push({ pathname: '/category/[id]/edit', params: { id } })
        }
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="danger" onPress={deleteCategory} />
      </View>
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
  buttonSpacing: {
    marginTop: 10,
  },
});
