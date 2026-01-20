import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type DurationInputProps = {
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
};

function parseNumericInput(text: string, max: number): number {
  const value = parseInt(text, 10);
  if (isNaN(value)) return 0;
  return Math.max(0, Math.min(max, value));
}

export function DurationInput({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
}: DurationInputProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {t('form.duration')}
      </Text>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={hours > 0 ? String(hours) : ''}
              onChangeText={(text) => onHoursChange(parseNumericInput(text, 99))}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
            />
            <Text style={[styles.unit, { color: colors.textSecondary }]}>
              {t('duration.hrs')}
            </Text>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={minutes > 0 ? String(minutes) : ''}
              onChangeText={(text) => onMinutesChange(parseNumericInput(text, 59))}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
            />
            <Text style={[styles.unit, { color: colors.textSecondary }]}>
              {t('duration.min')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: fonts.sans,
    textAlign: 'center',
  },
  unit: {
    paddingRight: 16,
    fontSize: 14,
    fontFamily: fonts.sans,
  },
});
