import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Category, TripContext } from '../../_layout';

const COLOURS = ['#0F766E', '#1D4ED8', '#DC2626', '#D97706', '#7C3AED', '#059669', '#DB2777', '#0891B2'];

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
        <BackButton />
        <ScreenHeader title="Edit Category" subtitle={`Update ${category.name}`} />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <View style={styles.colourWrapper}>
            <Text style={styles.colourLabel}>Colour</Text>
            <View style={styles.swatchRow}>
              {COLOURS.map((c) => (
                <Pressable
                  key={c}
                  accessibilityLabel={`Select colour ${c}`}
                  accessibilityRole="button"
                  onPress={() => setColour(c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    colour === c && styles.swatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />
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
  colourWrapper: {
    marginBottom: 12,
  },
  colourLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  swatchSelected: {
    borderColor: '#0F172A',
    borderWidth: 2,
  },
});
