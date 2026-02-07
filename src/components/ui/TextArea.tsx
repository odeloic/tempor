import { useTheme } from '@/theme/ThemeProvider';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
}: TextAreaProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  return (
    <View style={styles.outer}>
      <Text
        style={[
          styles.label,
          {
            fontFamily: fonts.sansMedium,
            color: colors.textSecondary,
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.md,
            padding: spacing.md,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline={true}
          textAlignVertical="top"
          style={[
            styles.input,
            {
              fontFamily: fonts.sans,
              color: colors.textPrimary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    gap: 10,
    width: '100%',
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.65,
    lineHeight: 11 * 1.5,
  },
  inputContainer: {
    height: 100,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 15 * 1.5,
    textAlignVertical: 'top',
  },
});
