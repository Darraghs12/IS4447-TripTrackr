import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

type Props = {
  colorScheme?: 'light' | 'dark';
};

export default function BackButton({ colorScheme }: Props) {
  const router = useRouter();
  const iconColor = colorScheme === 'dark' ? '#ECEDEE' : '#0F172A';
  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={() => router.back()}
      style={styles.button}
    >
      <Ionicons name="arrow-back" size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
});
