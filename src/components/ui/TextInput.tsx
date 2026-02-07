import { useTheme } from '@/theme/ThemeProvider';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

export function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: TextInputProps) {
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
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          style={[
            styles.input,
            {
              fontFamily: fonts.sansSemiBold,
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
    height: 56,
    justifyContent: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 17 * 1.5,
  },
});
