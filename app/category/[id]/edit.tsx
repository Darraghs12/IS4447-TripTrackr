import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Category, TripContext } from '../../_layout';

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const category = context?.categories.find(
    (c: Category) => c.id === Number(id)
  );

  useEffect(() => {
    if (!category) return;
    setName(category.name);
    setColour(category.colour);
  }, [category]);

  if (!context || !category) return null;

  const { setCategories } = context;

  const saveChanges = async () => {
    await db
      .update(categoriesTable)
      .set({ name, colour })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Edit Category" subtitle={`Update ${category.name}`} />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Colour" value={colour} onChangeText={setColour} placeholder="#0F766E" />
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />
        <View style={styles.buttonSpacing}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
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
  buttonSpacing: {
    marginTop: 10,
  },
});
