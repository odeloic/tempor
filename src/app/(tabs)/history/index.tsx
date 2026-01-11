/** TODO: Use Flat list or Flash list */
import { type Session } from '@/atoms/sessions';
import { dateRangeFilterAtom, projectFilterAtom } from '@/atoms/ui';
import {
  EmptyState,
  HistoryFilterBar,
  TimeEntryCard,
  TotalHoursCard,
} from '@/components/History';
import { useProjects } from '@/hooks/useProjects';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { formatDateLabel, getDateKey } from '@/lib/date';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GroupedEntries = {
  dateKey: string;
  label: string;
  entries: Session[];
};

export default function HistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { projects, getProject } = useProjects();

  const [selectedProjectIds, setSelectedProjectIds] = useAtom(projectFilterAtom);
  const [dateRange, setDateRange] = useAtom(dateRangeFilterAtom);

  const { entries, totalDuration, isLoading } = useTimeEntries({
    projectIds: selectedProjectIds.length > 0 ? selectedProjectIds : undefined,
    dateRange: dateRange ?? undefined,
  });

  const handleProjectToggle = useCallback(
    (projectId: number) => {
      setSelectedProjectIds((prev) => {
        if (prev.includes(projectId)) {
          return prev.filter((id) => id !== projectId);
        }
        return [...prev, projectId];
      });
    },
    [setSelectedProjectIds]
  );

  const handleClearProjectFilter = useCallback(() => {
    setSelectedProjectIds([]);
  }, [setSelectedProjectIds]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedProjectIds([]);
    setDateRange(null);
  }, [setSelectedProjectIds, setDateRange]);

  const hasFilters = selectedProjectIds.length > 0 || dateRange !== null;

  const groupedEntries = useMemo(() => {
    const groups: Record<string, GroupedEntries> = {};

    for (const entry of entries) {
      const dateKey = getDateKey(entry.date.getTime());
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateKey,
          label: formatDateLabel(entry.date.getTime()),
          entries: [],
        };
      }
      groups[dateKey].entries.push(entry);
    }

    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [entries]);

  const handleEntryPress = useCallback(
    (entryId: number) => {
      router.push(`/history/${entryId}`);
    },
    [router]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: 120 },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Time History
        </Text>
        {hasFilters && (
          <Pressable
            onPress={handleClearAllFilters}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.clearText, { color: colors.textSecondary }]}>
              Clear filters
            </Text>
          </Pressable>
        )}
      </View>

      <HistoryFilterBar
        projects={projects}
        selectedProjectIds={selectedProjectIds}
        onProjectToggle={handleProjectToggle}
        onClearProjectFilter={handleClearProjectFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <TotalHoursCard totalSeconds={totalDuration} />

      {entries.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        groupedEntries.map((group) => (
          <View key={group.dateKey} style={styles.dateGroup}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
              {group.label}
            </Text>
            <View style={styles.entriesList}>
              {group.entries.map((entry) => (
                <TimeEntryCard
                  key={entry.id}
                  entry={entry}
                  project={getProject(Number(entry.projectId))}
                  onPress={() => handleEntryPress(entry.id)}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.sansSemiBold,
  },
  clearText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  dateGroup: {
    marginBottom: spacing.lg,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  entriesList: {
    gap: 6,
  },
});
