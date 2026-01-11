import { ScrollView, StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { type Project } from '@/db/schema';
import { type DateRange } from '@/hooks/useTimeEntries';
import { ProjectFilterChip } from './ProjectFilterChip';
import { DateRangeFilter } from './DateRangeFilter';

type HistoryFilterBarProps = {
  projects: Project[];
  selectedProjectIds: number[];
  onProjectToggle: (projectId: number) => void;
  onClearProjectFilter: () => void;
  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
};

export function HistoryFilterBar({
  projects,
  selectedProjectIds,
  onProjectToggle,
  onClearProjectFilter,
  dateRange,
  onDateRangeChange,
}: HistoryFilterBarProps) {
  const allSelected = selectedProjectIds.length === 0;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProjectFilterChip
          isSelected={allSelected}
          onPress={onClearProjectFilter}
          label="All Projects"
        />
        {projects.map((project) => (
          <ProjectFilterChip
            key={project.id}
            project={project}
            isSelected={selectedProjectIds.includes(project.id)}
            onPress={() => onProjectToggle(project.id)}
          />
        ))}
        <View style={styles.divider} />
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  divider: {
    width: 1,
    marginHorizontal: spacing.xs,
  },
});
