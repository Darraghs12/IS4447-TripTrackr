import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from './_layout';

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');

  if (!context) return null;
  const { setCategories } = context;

  const saveCategory = async () => {
    await db.insert(categoriesTable).values({ name, colour });

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
        <ScreenHeader title="Add Category" subtitle="Create a new category." />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Colour" value={colour} onChangeText={setColour} placeholder="#0F766E" />
        </View>

        <PrimaryButton label="Save Category" onPress={saveCategory} />
        <View style={styles.backButton}>
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
  backButton: {
    marginTop: 10,
  },
});
