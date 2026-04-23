import { Colours } from '@/constants/colours';
import { Chip } from '@rneui/themed';

type Props = {
  label: string;
  value: string;
};

export default function InfoTag({ label, value }: Props) {
  return (
    <Chip
      title={`${label}: ${value}`}
      containerStyle={{ marginRight: 8, marginBottom: 6 }}
      buttonStyle={{
        backgroundColor: Colours.primaryLight,
        borderColor: Colours.primaryLight,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
      titleStyle={{
        color: Colours.primary,
        fontSize: 12,
        fontWeight: '500',
      }}
      type="solid"
    />
  );
}
