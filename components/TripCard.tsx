import { Category, Trip } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { Colours } from '@/constants/colours';
import { formatDate } from '@/db/utils';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  trip: Trip;
  category?: Category;
  activityCount?: number;
};

export default function TripCard({ trip, category, activityCount }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/trip/[id]', params: { id: trip.id.toString() } });
  const tripSummary = `${trip.name}, ${trip.destination}, ${trip.startDate} to ${trip.endDate}`;

  return (
    <Pressable
      accessibilityLabel={`${tripSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [pressed ? styles.cardPressed : null]}
    >
      <Card
        containerStyle={styles.card}
        wrapperStyle={styles.cardWrapper}
      >
        <View style={styles.header}>
          <Card.Title style={styles.name}>{trip.name}</Card.Title>
          <View style={styles.headerRight}>
            {activityCount !== undefined && activityCount > 0 && (
              <Badge
                value={activityCount}
                badgeStyle={{ backgroundColor: Colours.primary }}
                textStyle={{ fontSize: 11, fontWeight: '600' }}
                containerStyle={{ marginRight: 6 }}
              />
            )}
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
        </View>

        <View style={styles.tags}>
          <InfoTag label="Destination" value={trip.destination} />
          <InfoTag label="From" value={formatDate(trip.startDate)} />
          <InfoTag label="To" value={formatDate(trip.endDate)} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 0,
    marginTop: 0,
    padding: 14,
    shadowColor: 'transparent',
    elevation: 0,
  },
  cardWrapper: {
    padding: 0,
  },
  cardPressed: {
    opacity: 0.88,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    color: Colours.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
    marginBottom: 0,
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
