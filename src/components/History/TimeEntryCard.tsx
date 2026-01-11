import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, radii, spacing } from '@/theme/tokens';
import { formatDuration } from '@/lib/time';
import { type Session } from '@/atoms/sessions';
import { type Project } from '@/db/schema';

type TimeEntryCardProps = {
  entry: Session;
  project: Project | undefined;
  onPress?: () => void;
};

export function TimeEntryCard({ entry, project, onPress }: TimeEntryCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.colorBar,
          { backgroundColor: project?.color ?? colors.border },
        ]}
      />
      <View style={styles.content}>
        <Text
          style={[styles.projectName, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {project?.name ?? 'Unknown Project'}
        </Text>
        {entry.note && (
          <Text
            style={[styles.note, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {entry.note}
          </Text>
        )}
      </View>
      <Text style={[styles.duration, { color: colors.textPrimary }]}>
        {formatDuration(entry.duration)}
      </Text>
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
    borderRadius: radii.md,
    borderWidth: 1,
  },
  colorBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansMedium,
  },
  note: {
    fontSize: 13,
    fontFamily: fonts.sans,
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    fontFamily: fonts.mono,
  },
});
