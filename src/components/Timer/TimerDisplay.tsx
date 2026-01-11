import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { formatElapsed } from '@/lib/time';
import { useEffect, useRef } from 'react';

type TimerDisplayProps = {
  elapsed: number;
  isPaused?: boolean;
};

export function TimerDisplay({ elapsed, isPaused = false }: TimerDisplayProps) {
  const { colors, fonts } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isPaused) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      animation?.stop();
      pulseAnim.setValue(1);
    };
  }, [isPaused, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.time,
          {
            color: colors.textPrimary,
            fontFamily: fonts.mono,
            opacity: isPaused ? pulseAnim : 1,
          },
        ]}
      >
        {formatElapsed(elapsed)}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 64,
    letterSpacing: -1,
    lineHeight: 64,
  },
});
