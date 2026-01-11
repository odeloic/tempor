import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, fonts, radii, statusColors } from '@/theme/tokens';
import { type Project } from '@/db/schema';

type TimerStatus = 'idle' | 'running' | 'paused';

type QuickStartProjectCardProps = {
  project: Project;
  isActive: boolean;
  timerStatus: TimerStatus;
  onPress: () => void;
};

export function QuickStartProjectCard({
  project,
  isActive,
  timerStatus,
  onPress,
}: QuickStartProjectCardProps) {
  const { colors } = useTheme();

  const showRunningIndicator = isActive && timerStatus !== 'idle';
  const indicatorColor = timerStatus === 'running' ? statusColors.running : statusColors.paused;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isActive ? colors.textPrimary : colors.surface,
          borderColor: isActive ? 'transparent' : colors.border,
          borderWidth: isActive ? 0 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.colorDot, { backgroundColor: project.color }]} />
      <Text
        style={[
          styles.projectName,
          { color: isActive ? colors.background : colors.textPrimary },
        ]}
      >
        {project.name}
      </Text>
      {showRunningIndicator && (
        <View
          style={[styles.runningIndicator, { backgroundColor: indicatorColor }]}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  projectName: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
  },
  runningIndicator: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
});
