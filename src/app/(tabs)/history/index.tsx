/** TODO: Use Flat list or Flash list */
import { dateRangeFilterAtom, projectFilterAtom } from '@/atoms/ui';
import {
  AggregatedEntryCard,
  EmptyState,
  HistoryFilterBar,
  TotalHoursCard,
} from '@/components/History';
import { useProjects } from '@/hooks/useProjects';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { formatDateLabel } from '@/lib/date';
import { aggregateSessionsByProjectAndDate, type AggregatedEntry } from '@/lib/sessions';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { AppScrollView } from '@/components/ui/AppScrollView';
import { Screen } from '@/components/ui/Screen';
import { ScreenSection } from '@/components/ui/ScreenSection';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GroupedEntries = {
  dateKey: string;
  label: string;
  entries: AggregatedEntry[];
};

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { projects, getProject } = useProjects();

  const [selectedProjectIds, setSelectedProjectIds] = useAtom(projectFilterAtom);
  const [dateRange, setDateRange] = useAtom(dateRangeFilterAtom);

  const { entries, totalDuration } = useTimeEntries({
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
    const aggregatedEntries = aggregateSessionsByProjectAndDate(entries);
    const groups: Record<string, GroupedEntries> = {};

    for (const entry of aggregatedEntries) {
      if (!groups[entry.dateKey]) {
        groups[entry.dateKey] = {
          dateKey: entry.dateKey,
          label: formatDateLabel(entry.date.getTime()),
          entries: [],
        };
      }
      groups[entry.dateKey].entries.push(entry);
    }

    // Sort entries within each group by total duration descending
    for (const group of Object.values(groups)) {
      group.entries.sort((a, b) => b.totalDuration - a.totalDuration);
    }

    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [entries]);

  const handleSessionPress = useCallback(
    (sessionId: number) => {
      router.push(`/history/${sessionId}`);
    },
    [router]
  );

  return (
    <Screen>
      <AppScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: 120 },
        ]}
      >
        <ScreenSection>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('history.title')}
            </Text>
            {hasFilters && (
              <Pressable
                onPress={handleClearAllFilters}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.clearText, { color: colors.textSecondary }]}>
                  {t('history.clearFilters')}
                </Text>
              </Pressable>
            )}
          </View>
        </ScreenSection>

        <HistoryFilterBar
          projects={projects}
          selectedProjectIds={selectedProjectIds}
          onProjectToggle={handleProjectToggle}
          onClearProjectFilter={handleClearProjectFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <ScreenSection>
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
                    <AggregatedEntryCard
                      key={`${entry.projectId}-${entry.dateKey}`}
                      entry={entry}
                      project={getProject(Number(entry.projectId))}
                      onSessionPress={handleSessionPress}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScreenSection>
      </AppScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 0,
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
