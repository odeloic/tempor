import { useTheme } from '@/theme/ThemeProvider';
import { Text } from 'react-native';

type TimerDisplayProps = {
  elapsed: number;
};

export function TimerDisplay({ elapsed }: TimerDisplayProps) {
  const { colors, fonts } = useTheme();

  // TODO: Use formatElapsed from lib/time
  return (
    <Text style={{ color: colors.textPrimary, fontFamily: fonts.mono, fontSize: 48 }}>
      00:00:00
    </Text>
  );
}