import { Activity } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { formatDate } from '@/db/utils';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  activity: Activity;
  tripId: number;
  categoryName?: string;
};

export default function ActivityCard({ activity, tripId, categoryName }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({
      pathname: '/trip/[id]/activity/[activityId]',
      params: { id: tripId.toString(), activityId: activity.id.toString() },
    });
  const activitySummary = `${activity.name}, ${activity.date}, ${activity.duration} ${activity.metric}`;

  return (
    <Pressable
      accessibilityLabel={`${activitySummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={styles.name}>{activity.name}</Text>
      </View>

      <View style={styles.tags}>
        <InfoTag label="Date" value={formatDate(activity.date)} />
        <InfoTag label="Duration" value={`${activity.duration} ${activity.metric}`} />
        {categoryName ? <InfoTag label="Category" value={categoryName} /> : null}
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
