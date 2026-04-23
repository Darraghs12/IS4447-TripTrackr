import { Activity } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { Colours } from '@/constants/colours';
import { formatDate } from '@/db/utils';
import { ListItem } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
    <ListItem
      accessibilityLabel={`${activitySummary}, view details`}
      onPress={openDetails}
      containerStyle={styles.card}
      bottomDivider={false}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.name}>{activity.name}</ListItem.Title>
        <View style={styles.tags}>
          <InfoTag label="Date" value={formatDate(activity.date)} />
          <InfoTag label="Duration" value={`${activity.duration} ${activity.metric}`} />
          {categoryName ? <InfoTag label="Category" value={categoryName} /> : null}
        </View>
      </ListItem.Content>
      <ListItem.Chevron color={Colours.border} />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.surface,
    borderColor: Colours.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  name: {
    color: Colours.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
});
