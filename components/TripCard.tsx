import { Trip } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { formatDate } from '@/db/utils';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  trip: Trip;
};

export default function TripCard({ trip }: Props) {
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
      <View>
        <Text style={styles.name}>{trip.name}</Text>
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
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
