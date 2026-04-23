import { Colours } from '@/constants/colours';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  textColor?: string;
  subtitleColor?: string;
};

export default function ScreenHeader({ title, subtitle, textColor, subtitleColor }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, textColor ? { color: textColor } : null]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleColor ? { color: subtitleColor } : null]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: Colours.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});
