# Teaching Notes

## Strict Style Rules — match exactly, no exceptions

### Component structure — always this exact shape:
import { ... } from '...';

type Props = {
  label: string;
  value: string;
};

export default function ComponentName({ label, value }: Props) {
  return (
    ...
  );
}

const styles = StyleSheet.create({
  ...
});

### Never arrow function components — wrong:
const MyComponent = () => { ... }

### Always this — correct:
export default function MyComponent() { ... }

### After every DB write — always re-fetch:
await db.insert(table).values({ ... });
const rows = await db.select().from(table);
setItems(rows);
router.back();

### Context guard — always first line after hooks:
if (!context) return null;

### Navigation:
router.push({ pathname: '/trip/[id]', params: { id: trip.id.toString() } });
router.back();

### Colour palette — only these colours, no others:
#F8FAFC — background
#FFFFFF — card background
#111827 — primary text
#0F172A — dark
#6B7280 — subtitle/muted text
#334155 — label text
#94A3B8 — border/placeholder
#CBD5E1 — input border
#E5E7EB — card border
#0F766E — primary button
#EFF6FF — info tag background
#1D4ED8 — info tag label
#1E3A8A — info tag value
#FEF2F2 — danger button background
#FCA5A5 — danger button border
#7F1D1D — danger button text

### StyleSheet — always at bottom, always named styles:
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  ...
});

### Never inline styles — wrong:
<View style={{ padding: 20 }}>

### Imports order — React Native first, then expo, then local:
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { TripContext } from '../_layout';

### No useMemo, useCallback, custom hooks for DB
### No .then() — always async/await
### No external UI libraries
### Minimal comments — only where lab has them
### Always @/ path alias, never relative paths for components/db
### Always accessibilityLabel and accessibilityRole on Pressable
### Empty state — always a Text component, never null
### Always ScrollView with contentContainerStyle, never FlatList