import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type NoteInputProps = {
  value: string;
  onChange: (note: string) => void;
};

export function NoteInput({ value, onChange }: NoteInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        NOTE{' '}
        <Text style={styles.optional}>(optional)</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder="What did you work on?"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  optional: {
    textTransform: 'none',
    fontFamily: fonts.sans,
    letterSpacing: 0,
  },
  input: {
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: fonts.sans,
    minHeight: 100,
  },
});
