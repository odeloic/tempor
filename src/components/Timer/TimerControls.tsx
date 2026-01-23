import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing, radii, fonts } from '@/theme/tokens';

type TimerStatus = 'idle' | 'running' | 'paused';

type TimerControlsProps = {
  status: TimerStatus;
  hasProject: boolean;
  onStart: () => void;
  onStop: () => void;
  onDiscard: () => void;
};

export function TimerControls({
  status,
  hasProject,
  onStart,
  onStop,
  onDiscard,
}: TimerControlsProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (status === 'idle' && hasProject) {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.textPrimary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {t('timer.controls.start')}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'running' || status === 'paused') {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={onStop}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.textPrimary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {t('timer.controls.stop')}
          </Text>
        </Pressable>
        <Pressable
          onPress={onDiscard}
          style={({ pressed }) => [
            styles.button,
            styles.outlineButton,
            { borderColor: colors.destructive, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.destructive }]}>
            {t('timer.controls.discard')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0.3,
  },
});
