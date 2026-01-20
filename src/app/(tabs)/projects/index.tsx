import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/Project/ProjectCard';

export default function ProjectsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { projects, isLoading } = useProjects();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('projects.title')}
        </Text>
        <Pressable
          onPress={() => router.push('/project/new')}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: colors.textPrimary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={24} color={colors.background} />
        </Pressable>
      </View>

      {/* Projects List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => router.push(`/(tabs)/projects/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('projects.noProjects')}
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {t('projects.createFirst')}
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.sansSemiBold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  separator: {
    height: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.sansMedium,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.sans,
  },
});