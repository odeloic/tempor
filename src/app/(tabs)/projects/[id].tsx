import { ProjectForm } from "@/components/Project/ProjectForm";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useProjects } from "@/hooks/useProjects";
import { useTheme } from "@/theme/ThemeProvider";
import { fonts, spacing } from "@/theme/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getProject, updateProject, deleteProject, hasTimeEntries } =
    useProjects();

  const [hasEntries, setHasEntries] = useState(false);
  const project = getProject(Number(id));

  useEffect(() => {
    if (id) {
      hasTimeEntries(Number(id)).then(setHasEntries);
    }
  }, [id, hasTimeEntries]);

  const handleSave = async (data: {
    name: string;
    client: string | null;
    color: string;
  }) => {
    await updateProject(Number(id), data);
    router.back();
  };

  const handleDelete = async () => {
    await deleteProject(Number(id));
    router.back();
  };

  if (!project) {
    return (
      <Screen>
        <Text style={[styles.notFound, { color: colors.textSecondary }]}>
          {t("projects.notFound")}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <ScreenHeader
        title={t("projectForm.editProject")}
        onBack={() => router.back()}
        style={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.lg,
        }}
      />

      {/* Form */}
      <ProjectForm
        project={project}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => router.back()}
        hasTimeEntries={hasEntries}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontFamily: fonts.sans,
  },
});
