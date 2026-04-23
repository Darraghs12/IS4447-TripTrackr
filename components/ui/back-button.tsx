import { Colours } from '@/constants/colours';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

type Props = {
  colorScheme?: 'light' | 'dark';
};

export default function BackButton({ colorScheme }: Props) {
  const router = useRouter();
  const iconColor = colorScheme === 'dark' ? '#ECEDEE' : Colours.textPrimary;
  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={() => router.back()}
      style={styles.button}
    >
      <Icon name="arrow-back" type="ionicon" size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
});
