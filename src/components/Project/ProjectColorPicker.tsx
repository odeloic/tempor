import { Pressable, StyleSheet, View } from 'react-native';
import { projectColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/tokens';

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export function ProjectColorPicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {projectColors.map((color) => (
        <Pressable
          key={color}
          onPress={() => onChange(color)}
          style={[
            styles.colorButton,
            {
              backgroundColor: color,
              borderColor: value === color ? colors.textPrimary : 'transparent',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 3,
  },
});