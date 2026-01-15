import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, radii, spacing } from '@/theme/tokens';
import { formatDuration } from '@/lib/time';
import { type AggregatedEntry } from '@/lib/sessions';
import { type Project } from '@/db/schema';
import { useCallback, useState } from 'react';

type AggregatedEntryCardProps = {
  entry: AggregatedEntry;
  project: Project | undefined;
  onSessionPress?: (sessionId: number) => void;
};

export function AggregatedEntryCard({
  entry,
  project,
  onSessionPress,
}: AggregatedEntryCardProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const isSingleSession = entry.sessionCount === 1;
  const firstSessionId = entry.sessions[0]?.id;

  const handlePress = useCallback(() => {
    if (isSingleSession && firstSessionId !== undefined) {
      onSessionPress?.(firstSessionId);
    } else {
      setIsExpanded((prev) => !prev);
    }
  }, [isSingleSession, firstSessionId, onSessionPress]);

  return (
    <View>
      <Pressable
        onPress={handlePress}
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
          <View style={styles.projectRow}>
            <Text
              style={[styles.projectName, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {project?.name ?? 'Unknown Project'}
            </Text>
            {!isSingleSession && (
              <Text style={[styles.sessionCount, { color: colors.textSecondary }]}>
                {entry.sessionCount} sessions
              </Text>
            )}
          </View>
          {isSingleSession && entry.sessions[0].note && (
            <Text
              style={[styles.note, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {entry.sessions[0].note}
            </Text>
          )}
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.duration, { color: colors.textPrimary }]}>
            {formatDuration(entry.totalDuration)}
          </Text>
          {!isSingleSession && (
            <Text style={[styles.expandIcon, { color: colors.textSecondary }]}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          )}
        </View>
      </Pressable>

      {isExpanded && !isSingleSession && (
        <View style={[styles.sessionsContainer, { borderColor: colors.border }]}>
          {entry.sessions.map((session) => (
            <Pressable
              key={session.id}
              onPress={() => onSessionPress?.(session.id)}
              style={({ pressed }) => [
                styles.sessionRow,
                {
                  backgroundColor: pressed ? colors.surface : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.sessionContent}>
                <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                  {session.createdAt.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
                {session.note && (
                  <Text
                    style={[styles.sessionNote, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {session.note}
                  </Text>
                )}
              </View>
              <Text style={[styles.sessionDuration, { color: colors.textPrimary }]}>
                {formatDuration(session.duration)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
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
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansMedium,
    flexShrink: 1,
  },
  sessionCount: {
    fontSize: 12,
    fontFamily: fonts.sans,
  },
  note: {
    fontSize: 13,
    fontFamily: fonts.sans,
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 2,
  },
  duration: {
    fontSize: 14,
    fontFamily: fonts.mono,
  },
  expandIcon: {
    fontSize: 8,
    fontFamily: fonts.sans,
  },
  sessionsContainer: {
    marginLeft: 22,
    marginTop: 4,
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  sessionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  sessionTime: {
    fontSize: 12,
    fontFamily: fonts.sans,
    width: 70,
  },
  sessionNote: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.sans,
  },
  sessionDuration: {
    fontSize: 13,
    fontFamily: fonts.mono,
  },
});
