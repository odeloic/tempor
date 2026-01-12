import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type ToastProps = {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
};

export function Toast({ message, visible, duration = 2500, onHide }: ToastProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: duration - 400 }),
        withTiming(0, { duration: 200 }, () => {
          runOnJS(onHide)();
        })
      );
      translateY.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(0, { duration: duration - 400 }),
        withTiming(-20, { duration: 200 })
      );
    }
  }, [visible, duration, onHide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        animatedStyle,
        {
          top: insets.top + spacing.md,
          backgroundColor: colors.textPrimary,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.background }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
    borderRadius: radii.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    textAlign: 'center',
  },
});
