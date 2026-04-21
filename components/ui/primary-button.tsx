import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  compact?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  compact = false,
  variant = 'primary',
  disabled = false,
}: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'danger' ? styles.danger : null,
        compact ? styles.compact : null,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? styles.secondaryLabel : null,
          variant === 'danger' ? styles.dangerLabel : null,
          compact ? styles.compactLabel : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondary: {
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    borderWidth: 1,
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  compact: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryLabel: {
    color: '#0F172A',
  },
  dangerLabel: {
    color: '#7F1D1D',
  },
  compactLabel: {
    fontSize: 13,
  },
});
