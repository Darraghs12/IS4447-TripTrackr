import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function BackButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={() => router.back()}
      style={styles.button}
    >
      <Ionicons name="arrow-back" size={24} color="#0F172A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
});
