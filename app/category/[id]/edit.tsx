import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import BackButton from '@/components/ui/back-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { Icon } from '@rneui/themed';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Category, TripContext } from '../../_layout';

const COLOURS = ['#0F766E', '#1D4ED8', '#DC2626', '#D97706', '#7C3AED', '#059669', '#DB2777', '#0891B2'];

const ICONS = [
  'map-outline', 'restaurant-outline', 'walk-outline', 'camera-outline',
  'bed-outline', 'airplane-outline', 'car-outline', 'boat-outline',
  'bicycle-outline', 'wine-outline', 'football-outline', 'musical-notes-outline',
] as const;

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const [icon, setIcon] = useState('map-outline');
  const category = context?.categories.find(
    (c: Category) => c.id === Number(id)
  );

  useEffect(() => {
    if (!category) return;
    setName(category.name);
    setColour(category.colour);
    setIcon(category.icon ?? 'map-outline');
  }, [category]);

  if (!context || !category) return null;

  const { setCategories, colorScheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : Colours.background;

  const saveChanges = async () => {
    await db
      .update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton colorScheme={colorScheme} />
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

          <View style={styles.iconWrapper}>
            <Text style={styles.iconLabel}>Icon</Text>
            <View style={styles.iconRow}>
              {ICONS.map((ic) => {
                const isSelected = icon === ic;
                return (
                  <Pressable
                    key={ic}
                    accessibilityLabel={`Select icon ${ic}`}
                    accessibilityRole="button"
                    onPress={() => setIcon(ic)}
                    style={[styles.iconButton, isSelected && styles.iconButtonSelected]}
                  >
                    <Icon
                      name={ic as any}
                      type="ionicon"
                      size={24}
                      color={isSelected ? Colours.primary : Colours.textPrimary}
                    />
                  </Pressable>
                );
              })}
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
    color: Colours.labelText,
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
    borderColor: Colours.textPrimary,
    borderWidth: 2,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  iconLabel: {
    color: Colours.labelText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: Colours.background,
    borderColor: Colours.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconButtonSelected: {
    backgroundColor: Colours.primaryLight,
    borderColor: Colours.primary,
    borderWidth: 2,
  },
});
