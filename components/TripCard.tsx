import { Category, Trip } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { formatDate } from '@/db/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  trip: Trip;
  category?: Category;
};

export default function TripCard({ trip, category }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/trip/[id]', params: { id: trip.id.toString() } });
  const tripSummary = `${trip.name}, ${trip.destination}, ${trip.startDate} to ${trip.endDate}`;

  return (
    <Pressable
      accessibilityLabel={`${tripSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{trip.name}</Text>
        {category ? (
          <View style={styles.categoryBadge}>
            <Ionicons
              name={(category.icon ?? 'map-outline') as any}
              size={14}
              color={category.colour}
            />
            <Text style={[styles.categoryName, { color: category.colour }]}>
              {category.name}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.tags}>
        <InfoTag label="Destination" value={trip.destination} />
        <InfoTag label="From" value={formatDate(trip.startDate)} />
        <InfoTag label="To" value={formatDate(trip.endDate)} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  categoryBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
