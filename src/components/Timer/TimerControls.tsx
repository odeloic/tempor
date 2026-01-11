import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, radii, fonts } from '@/theme/tokens';

type TimerStatus = 'idle' | 'running' | 'paused';

type TimerControlsProps = {
  status: TimerStatus;
  hasProject: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDiscard: () => void;
};

export function TimerControls({
  status,
  hasProject,
  onStart,
  onPause,
  onResume,
  onStop,
  onDiscard,
}: TimerControlsProps) {
  const { colors } = useTheme();

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
            Start
          </Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'running') {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={onPause}
          style={({ pressed }) => [
            styles.button,
            styles.outlineButton,
            { borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Pause
          </Text>
        </Pressable>
        <Pressable
          onPress={onStop}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.textPrimary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Stop
          </Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'paused') {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={onResume}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.textPrimary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Resume
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
            Discard
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
