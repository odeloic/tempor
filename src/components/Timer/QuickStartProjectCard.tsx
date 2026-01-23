import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, radii, statusColors } from '@/theme/tokens';
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
          borderWidth: 0.5,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.colorDot, { backgroundColor: project.color }]} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.projectName,
            { color: isActive ? colors.background : colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {project.name}
        </Text>
        {project.client && (
          <Text
            style={[
              styles.clientName,
              { color: isActive ? colors.background : colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {project.client}
          </Text>
        )}
      </View>
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
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
  },
  clientName: {
    fontSize: 13,
    fontFamily: fonts.sans,
    opacity: 0.7,
  },
  runningIndicator: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
});
