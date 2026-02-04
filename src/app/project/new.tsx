import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { spacing } from '@/theme/tokens';
import { useProjects } from '@/hooks/useProjects';
import { ProjectForm } from '@/components/Project/ProjectForm';

export default function NewProjectModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { createProject } = useProjects();

  const handleSave = async (data: { name: string; client: string | null; color: string }) => {
    await createProject(data);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <Screen>
        {/* Header */}
        <ScreenHeader
          title={t('projectForm.newProject')}
          onBack={() => router.back()}
          style={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing.lg }}
        />

        {/* Form */}
        <ProjectForm
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
