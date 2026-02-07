import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface WorkHistoryItemProps {
  projectName: string;
  projectColor: string;
  note?: string;
  duration: string;
  onPress?: () => void;
}

export function WorkHistoryItem({
  projectName,
  projectColor,
  note,
  duration,
  onPress,
}: WorkHistoryItemProps) {
  const { colors, fonts, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.md,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[styles.colorBar, { backgroundColor: projectColor }]}
      />
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: fonts.sansMedium },
          ]}
          numberOfLines={1}
        >
          {projectName}
        </Text>
        {note ? (
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: fonts.sans },
            ]}
            numberOfLines={1}
          >
            {note}
          </Text>
        ) : null}
      </View>
      <Text
        style={[
          styles.duration,
          { color: colors.textPrimary, fontFamily: fonts.mono },
        ]}
      >
        {duration}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 77,
    gap: 14,
    paddingHorizontal: 18,
    borderWidth: 0.5,
  },
  colorBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
  info: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    lineHeight: 15 * 1.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 13 * 1.5,
  },
  duration: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
});
