import { ProjectBottomSheet } from '@/components/Project/ProjectBottomSheet';
import { type Project } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface ProjectPickerModalProps {
  visible: boolean;
  projects: Project[];
  selectedProjectId?: number;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onDismiss: () => void;
}

export function ProjectPickerModal({
  visible,
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onDismiss,
}: ProjectPickerModalProps) {
  const { height: screenHeight } = useWindowDimensions();
  const sheetHeight = screenHeight * 0.6;

  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 200 });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(sheetHeight, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, sheetHeight, translateY, backdropOpacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSelect = useCallback(
    (project: Project) => {
      onSelectProject(project);
      onDismiss();
    },
    [onSelectProject, onDismiss],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <AnimatedBlurView
          intensity={20}
          tint="dark"
          style={[StyleSheet.absoluteFill, backdropStyle]}
        />
      </Pressable>

      <Animated.View
        style={[styles.sheet, { height: sheetHeight }, sheetStyle]}
      >
        <ProjectBottomSheet
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelect}
          onCreateProject={onCreateProject}
          onDismiss={onDismiss}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
