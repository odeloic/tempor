import { scale } from "@/lib/scale";
import { formatElapsed } from "@/lib/time";
import { useTheme } from "@/theme/ThemeProvider";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type TimerStatus = "idle" | "empty" | "running" | "paused";

interface TimerDisplayProps {
  elapsed: number;
  status?: TimerStatus;
  /** @deprecated Use `status` instead. Kept for backward compatibility. */
  isPaused?: boolean;
}

const emptyColor = "#c4c1bb";

export function TimerDisplay({ elapsed, status, isPaused }: TimerDisplayProps) {
  const { colors, fonts } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Derive effective status: prefer explicit `status`, fall back to `isPaused`
  const effectiveStatus: TimerStatus = status
    ? status
    : isPaused
      ? "paused"
      : "idle";

  const isPausedState = effectiveStatus === "paused";

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isPausedState) {
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
        ]),
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      animation?.stop();
      pulseAnim.setValue(1);
    };
  }, [isPausedState, pulseAnim]);

  const textColor =
    effectiveStatus === "empty" ? emptyColor : colors.textPrimary;

  const fontSize = Math.min(scale(64), 80);
  const letterSpacing = -(fontSize * 0.02);

  return (
    <View style={styles.container}>
      <Animated.Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.time,
          {
            fontSize,
            letterSpacing,
            color: textColor,
            fontFamily: fonts.mono,
            opacity: isPausedState ? pulseAnim : 1,
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
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  time: {
    // fontSize and letterSpacing applied dynamically via scale()
  },
});
